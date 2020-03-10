const raml = require('raml-1-parser');
const tools = require('datatype-expansion');
const fs = require('fs');
const { ramlArrayToObject, recursiveObjectToArray, makeConsistent } = require('../utils/raml');


function _makeUniqueId(string) {
  const stringWithSpacesReplaced = string.replace(/\W/g, '_');
  const stringWithLeadingUnderscoreRemoved = stringWithSpacesReplaced.replace(new RegExp('^_+'), '');
  return stringWithLeadingUnderscoreRemoved.toLowerCase();
}

// Add unique id's and parent URL's plus parent URI parameters to resources
function _addRaml2htmlProperties(ramlObj, parentUrl, allUriParameters) {
  // Add unique id's to top level documentation chapters
  if (ramlObj.documentation) {
    ramlObj.documentation.forEach((docSection) => {
      docSection.uniqueId = _makeUniqueId(docSection.title);
    });
  }

  if (!ramlObj.resources) {
    return ramlObj;
  }

  ramlObj.resources.forEach((resource) => {
    resource.parentUrl = parentUrl || '';
    resource.uniqueId = _makeUniqueId(resource.parentUrl + resource.relativeUri);
    resource.allUriParameters = [];

    if (allUriParameters) {
      resource.allUriParameters.push.apply(resource.allUriParameters, allUriParameters);
    }

    if (resource.uriParameters) {
      resource.uriParameters.forEach((uriParameter) => {
        resource.allUriParameters.push(uriParameter);
      });
    }

    // Copy the RESOURCE uri parameters to the METHOD, because that's where they will be rendered.
    if (resource.methods) {
      resource.methods.forEach((method) => {
        method.allUriParameters = resource.allUriParameters;
      });
    }

    _addRaml2htmlProperties(resource, resource.parentUrl + resource.relativeUri, resource.allUriParameters);
  });

  return ramlObj;
}

// This uses the datatype-expansion library to expand all the root type to their canonical expanded form
function _expandRootTypes(types) {
  if (!types) {
    return types;
  }

  Object.keys(types).forEach((key) => {
    tools.expandedForm(types[key], types, (err, expanded) => {
      if (expanded) {
        tools.canonicalForm(expanded, (err2, canonical) => {
          if (canonical) {
            types[key] = canonical;
          }
        });
      }
    });
  });

  return types;
}

function _enhanceRamlObj(ramlObj) {
  ramlObj = ramlArrayToObject(ramlObj);
  const types = makeConsistent(_expandRootTypes(ramlObj.types));
  delete ramlObj.types;
  ramlObj = makeConsistent(ramlObj, types);
  ramlObj = recursiveObjectToArray(ramlObj);
  ramlObj = _addRaml2htmlProperties(ramlObj);

  if (types) {
    ramlObj.types = types;
  }

  return ramlObj;
}

function _sourceToRamlObj(source) {
  if (typeof source === 'string') {
    if (fs.existsSync(source) || source.indexOf('http') === 0) {
      // Parse as file or url
      return raml.loadApi(source, { rejectOnErrors: false }).then((result) => {
        if (result._node._universe._typedVersion === '0.8') {
          throw new Error('_sourceToRamlObj: only RAML 1.0 is supported!');
        }

        if (result.expand) {
          return result.expand(true).toJSON({ serializeMetadata: false });
        }

        return new Promise((resolve, reject) => {
          reject(new Error('_sourceToRamlObj: source could not be parsed. Is it a root RAML file?'));
        });
      });
    }

    return new Promise((resolve, reject) => {
      reject(new Error('_sourceToRamlObj: source does not exist.'));
    });
  } if (typeof source === 'object') {
    // Parse RAML object directly
    return new Promise((resolve) => {
      resolve(source);
    });
  }

  return new Promise((resolve, reject) => {
    reject(new Error('_sourceToRamlObj: You must supply either file, url or object as source.'));
  });
}

const parse = (source) => {
  return _sourceToRamlObj(source).then(ramlObj => {
    return _enhanceRamlObj(ramlObj)
  });
}

module.exports = {
  parse,
}
