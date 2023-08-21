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
  project: { type: String, required: true },
  issue_title: { required: true, type: String },
  issue_text: { required: true, type: String },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
  created_by: { required: true, type: String },
  assigned_to: {type: String, default: ''},
  open: { type: Boolean, default: true },
  status_text: {type: String, default: ''},
});

const Issue = mongoose.model('Issue', issueSchema);


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      
      let info = {...req.query}
      info['project'] = project;
       const issues =  Issue.find(info, 'assigned_to status_text open _id issue_title issue_text created_by created_on updated_on')
         .then(data => {
            return res.json(data)
          })
      })

    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (issue_title === undefined || issue_text === undefined || created_by === undefined) {
        return res.json({ error: 'required field(s) missing' })
      }
      const issue = Issue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        project: project
      })
      issue.save()
        .then((data) => {
          let object = {
            _id: data.id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_on: data.created_on,
            updated_on: data.updated_on,
            created_by: data.created_by,
            assigned_to: data.assigned_to || "",
            open: data.open,
            status_text: data.status_text || "",
          }
          return res.json(object)
        })

    })

    .put(function (req, res) {
      let project = req.params.project;
       //let info = Object.assign(req.body)
      let info = { ...req.body };
       for (const [key, value] of Object.entries(info)) {
        if (value === "" || value === undefined) {
          delete info[key]
        }
      }
      if(info.updated_on === undefined  || info.updated_on === "") {info.updated_on = new Date()}
      if (info._id === undefined || info._id === "") { return res.json({ error: 'missing _id' }) }
      
      else if (Object.keys(info).length < 3) { return res.json({ error: 'no update field(s) sent', '_id': info._id }) }
    
      Issue.findByIdAndUpdate(info._id, info)
        .then(data => {
          if (data) return res.json({  result: 'successfully updated', '_id': info._id })
          else return res.json({ error: 'could not update', '_id': info._id })
        })
        .catch(err => console.log(err))
    })

    .delete(function (req, res) {
      let project = req.params.project;
      
      if (req.body._id === "" || req.body._id === undefined) {
        return res.json({ error: 'missing _id' })
      }
      else {
        const issues = Issue.findByIdAndRemove({ _id: req.body._id })
          .then(data=> {
            if(data){return res.json({ result: 'successfully deleted', '_id': req.body._id })}
          else return res.json({ error: 'could not delete', '_id':  req.body._id })
          
          } )
      }
    });

  app.route('/api/issues/api')
    .post(function (req, res) {
  //    const issues = Issue.find({})
  //    .select({ __v: 0, project: 0 })
  //    .then(data => {
  //      res.json(data)
  //    })
    })

};
