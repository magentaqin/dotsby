const _arrayToObject = (arr) => {
  return arr.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      acc[key] = cur[key];
    });
    return acc;
  }, {});
}

const _isObject = (obj) => {
  return obj === Object(obj);
}

const _objectToArray = (obj) => {
  if (Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj).map((key) => {
    if (_isObject(obj[key])) {
      obj[key].key = key;
    }
    return obj[key];
  });
}


const ramlArrayToObject = (ramlObj) => {
  ['types', 'traits', 'resourceTypes', 'annotationTypes', 'securitySchemes'].forEach((key) => {
    if (ramlObj[key]) {
      ramlObj[key] = _arrayToObject(ramlObj[key]);
    }
  });

  return ramlObj;
}


const recursiveObjectToArray = (obj) => {
  if (_isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (_isObject(obj) && ['responses', 'body', 'queryParameters', 'headers', 'properties', 'baseUriParameters', 'annotations', 'uriParameters'].indexOf(key) !== -1) {
        obj[key] = _objectToArray(value);
      }

      recursiveObjectToArray(value);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((value) => {
      recursiveObjectToArray(value);
    });
  }

  return obj;
}

const makeConsistent = (obj, types) => {
  if (_isObject(obj)) {
    if (obj.type) {
      if (Array.isArray(obj.type)) {
        obj.type = obj.type[0];
      }

      if (obj.type === 'array' && Array.isArray(obj.items) && obj.items.length === 1) {
        obj.items = obj.items[0];
      }

      if (types && types[obj.type]) {
        const mergedObj = Object.assign({}, obj, types[obj.type]);

        // Every exception of inheritance should be deleted from mergedObj
        if (obj.description && types[obj.type].description) {
          delete mergedObj.description;
        }

        Object.assign(obj, mergedObj);
      }
    }

    if (obj.items && types && types[obj.items]) {
      obj.items = types[obj.items];
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }

      obj.examples.push(obj.structuredExample);
      delete obj.example;
      delete obj.structuredExample;
    }

    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map((example) => {
        if (!example.value) {
          return { value: example };
        }
        if (!example.displayName && example.name) {
          example.displayName = example.name;
        }
        return example;
      });
    }

    // Give each security scheme a displayName if it isn't already set
    if (obj.securitySchemes) {
      Object.keys(obj.securitySchemes).forEach((schemeName) => {
        const scheme = obj.securitySchemes[schemeName];
        scheme.displayName = scheme.displayName || scheme.name;
      });
    }

    if (Array.isArray(obj.securedBy)) {
      if (obj.securedBy.length === 0 || obj.securedBy.every(scheme => (scheme === null))) {
        // The RAML 1.0 spec allows that:
        //  "A securedBy node containing null as the array component indicates
        //   the method can be called without applying any security scheme."
        delete obj.securedBy;
      } else {
        // Guarantee that all elements of the securedBy array are either null or
        // objects containing a schemeName property (and an optional scopes property)
        obj.securedBy = obj.securedBy.map((scheme) => {
          if (scheme === null) {
            return null;
          }
          if (typeof scheme === 'string') {
            return { schemeName: scheme };
          }
          const schemeName = Object.keys(scheme)[0];
          return Object.assign({ schemeName }, scheme[schemeName] || {});
        });
      }
    }

    // Fix inconsistency between request headers and response headers from raml-1-parser.
    // https://github.com/raml-org/raml-js-parser-2/issues/582
    if (Array.isArray(obj.headers)) {
      obj.headers.forEach((hdr) => {
        if (typeof hdr.key === 'undefined' && hdr.name) {
          hdr.key = hdr.name;
        }
      });
    }

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      makeConsistent(value, types);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((value) => {
      makeConsistent(value, types);
    });
  }

  return obj;
}

module.exports = {
  ramlArrayToObject,
  recursiveObjectToArray,
  makeConsistent,
}