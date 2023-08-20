'use strict';
require('dotenv').config()
let mongoose = require("mongoose")
const Schema = mongoose.Schema

//connect to MongooDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Connection established!")
})

let issueSchema = new mongoose.Schema({
  issue_title: { required: true, type: String },
  issue_text: { required: true, type: String },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
  created_by: { required: true, type: String },
  assigned_to: String,
  open: { type: Boolean, default: true },
  status_text: String
});

const Issue = mongoose.model('Issue', issueSchema);


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'missing required fields' })
      }
      const issue = Issue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text
      })
      issue.save()
        .then((data) => {
          res.json({
            _id: data.id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_on: data.created_on,
            updated_on: data.updated_on,
            created_by: data.created_by,
            assigned_to: data.assigned_to,
            open: data.open,
            status_text: data.status_text
          })
        })

    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log(req.body, "put")
      let info = Object.assign(req.body)
      console.log(info)
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });

  app.route('/api/issues/api')
    .post(function (req, res) {
      console.log(req.query, "hereAPI")
    })


};
