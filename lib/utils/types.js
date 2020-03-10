const created_at_key = 'created_at';
const created_at_def = {
  type: "string",
  format: "date-time",
  example: "1996-12-19T16:39:57-08:00",
  description: "time created at",
};

const updated_at_key = 'updated_at';
const updated_at_def = {
  type: "string",
  format: "date-time",
  example: "1996-12-19T16:39:57-08:00",
  description: "time updated at",
};

const email_regx = '^(?:[0-9a-zA-Z]+(?:[0-9a-zA-Z-_.]){0,}){0,}[0-9a-zA-Z]@(?:(?:[0-9a-zA-Z]+(?:[0-9a-zA-Z-]){0,}){0,}[0-9a-zA-Z].){1,}[a-zA-Z]{2,20}$';
const password_regx = '^[a-zA-Z0-9]{6,20}$'
const version_regx = '^[0-9]{1,5}\.[0-9]{1,3}\.[0-9]{1,3}$'
const raml_regx = '^.*\.raml$'

module.exports = {
  created_at_key,
  created_at_def,
  updated_at_key,
  updated_at_def,
  email_regx,
  password_regx,
  version_regx,
  raml_regx,
}
