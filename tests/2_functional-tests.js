const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID
suite('Functional Tests', function () {
    test('POST - All fields', function (done) {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'to be deleted',
                issue_text: 'Text',
                created_by: 'Create',
                assigned_to: 'Assign',
                status_text: 'Status'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'to be deleted');
                assert.equal(res.body.issue_text, 'Text');
                assert.equal(res.body.created_by, 'Create')
                assert.equal(res.body.status_text, "Status")
                assert.equal(res.body.assigned_to, 'Assign')
                deleteID = res.body._id
                done();
            });
    })
    test('POST - Reqiuired Fields', (done) => {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                issue_text: 'Text',
                created_by: 'Create',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'Text');
                assert.equal(res.body.created_by, 'Create');
                done();
            });
    })
    test('POST - missing required field', (done) => {
        chai
            .request(server)
            .post('/api/issues/apitest')
            .send({ issue_title: 'Title' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    })
    test('GET request', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(Array.isArray(res.body), true);
                done();
            });
    })

    test('GET Request with 1 field', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .send({ issue_title: 'Title' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body[0], 'issue_title');
                done();
            });
    })
    test('GET Request with multiple fields', (done) => {
        chai
            .request(server)
            .get('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                issue_text: 'Text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(Array.isArray(res.body), true);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text')
                done();
            });
    })
    test('Update one field on an issue:', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '64e27378c6da9db1234b0085',
                issue_title: 'Title',
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '64e27378c6da9db1234b0085');
                done();
            });
    })
    test('Update multiple fields on an issue:', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '64e27378c6da9db1234b0085',
                issue_title: 'Title',
                issue_text: 'Text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '64e27378c6da9db1234b0085');

                done();
            });
    })


    test('Update an issue with missing _id', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                issue_text: 'Text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');


                done();
            });
    })

    test('Update an issue with no fields to update', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({ _id: '64e27378c6da9db1234b0085' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, '64e27378c6da9db1234b0085');
                done();
            });
    })
    test('Update an issue with an invalid _id', (done) => {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({ issue_title: 'Title', })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    })
    test('Delete an issue', (done) => {
        // const toDelete = await Issue.findOne({issue_title: 'to be deleted'}).exec()
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({ _id: deleteID })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, deleteID);
                done();
            });
    })

    test('Delete an issue with an invalid _id', (done) => {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send()
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    })

    test('Delete an issue with missing _id ', (done) => {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send()
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();

                after(function () {
                    chai.request(server)
                        .get('/api/issues/apitest/')
                });
            });
    })

});
