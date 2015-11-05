var assert  = require('chai').assert;
var gulpNSP = require('../');

describe('Invalid Usage Tests', function () {

  it('should say that it cant find the module', function (done) {
    gulpNSP({package: './someInvalidFile.json'}, function (err) {
      assert(err);
      assert(err.indexOf('Cannot find module') > -1);
      done();
    });
  });

  it('should error with a bad output option', function (done) {
    gulpNSP({
      package: __dirname + '/notVulnerables/package.json',
      output:  'iDontExistOutput'
    }, function (err) {
      console.log('err: ', err);
      assert(err);
      assert(err.indexOf('Invalid formatter specified') > -1);
      done();
    });
  });

});

describe('Package.json Usage Test', function () {
  this.timeout(6000);

  it('should finish with no errors and no vulns found', function (done) {
    gulpNSP({package: __dirname + '/notVulnerables/package.json'}, function (err) {
      assert(!err);
      done();
    });
  });

  it('should finish with vulnerabilities found', function (done) {
    gulpNSP({package: __dirname + '/vulnerables/package.json'}, function (err) {
      assert(err);
      done();
    });
  });

});

describe('Shrinkwrap.json Usage Test', function () {
  this.timeout(6000);

  it('should finish with no errors and no vulns found', function (done) {
    gulpNSP({package: __dirname + '/notVulnerables/npm-shrinkwrap.json'}, function (err) {
      assert(!err);
      done();
    });
  });

  //TODO: make a vulnerable shrinkwrap.json file.  This said there were no errors, but i
  //TODO: thought that there would be
  //it('should finish with vulns found', function (done) {
  //  gulpNSP({package: __dirname + '/vulnerables/npm-shrinkwrap.json'}, function (err) {
  //    console.log('err: ', err);
  //    assert(err);
  //    done();
  //  });
  //});
});
