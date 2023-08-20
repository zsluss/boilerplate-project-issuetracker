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
      const issues = Issue.findById(project)
        .select({ __v: 0, })
      res.json(issues)



    })

    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!project || !issue_title || !issue_text || !created_by) {
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
      let info = Object.assign(req.body)
      info.updated_on = new Date()
      for (const [key, value] of Object.entries(info)) {
        if (value === "" || value === undefined) {
          delete info[key]
        }
      }
      if (info._id === undefined) { res.json({ error: 'missing _id' }) }
      else if (Object.keys(info).length < 3) { res.json({ error: 'no update field(s) sent', '_id': info._id }) }
      Issue.findByIdAndUpdate(info._id, info).exec()
        .then(data =>{
        if(data) return  res.json({ result: 'successfully updated', '_id': info._id })
         else return res.json({error: 'could not update', '_id': info._id})
        })
        .catch(err=> console.log(err))
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (project = "") {
        res.json({ error: 'missing _id' })
      }
      else {
        const issues = Issue.findByIdAndRemove({_id: req.body._id})
        .then(
        res.json({ result: 'successfully deleted', '_id': req.body._id })
        )
      }
    });

  app.route('/api/issues/api')
    .post(function (req, res) {

    })

};
