Students = new Mongo.Collection('student');

if (Meteor.isClient) {
Meteor.subscribe('student');
Session.set('filter', {});
Tracker.autorun(function () {
  myId = Meteor.subscribe('adder', Session.get('filter'));
  console.log(myId);
});

Router.route('/', function(){
  window.location.replace('/addStudent');
});

Router.route('/addStudent', function(){
  this.render('addStudent');
});
Router.route('/listStudent', function(){
  this.render('listStudent');
});
  
  
  Template.addStudent.events({
    'click .button': function (event) {
      event.preventDefault();
      var d = {};
      d.name = document.getElementById('full-name').value;
      d.phone = document.getElementById('phone').value;
      d.class = document.getElementById('class').value;
      d.city = document.getElementById('city').value;
      console.log(JSON.stringify(d));

      Meteor.call('addTask', d, function (error, result) {
        if(error)
          console.log(error);
        else
          console.log(result);
      });
    }
  });


Template.listStudent.helpers({
  result: function () {
    var sorter = Session.get('sorter');
    console.log(sorter);

      if(sorter === undefined)
        return Students.find();

      if(sorter == 'name-down'){
       return Students.find({},{sort:{name:1}});
      }
      if(sorter == 'name-up'){
       return Students.find({},{sort:{name:-1}});
      }
  },
  counter: function () {
      return Students.find().count();
  }

});

Template.listStudent.events({
  'click .name.up.icon': function () {
   Session.set('sorter', 'name-up');
  },
  'click .name.down.icon': function () {
   Session.set('sorter', 'name-down');
  }
});

}



Meteor.methods({
  addTask: function(d){
Students.insert({
        name: d.name,
        phone: d.phone,
        class: d.class,
        city: d.city,
        createdAt: new Date()
      }, function(error){
        if(error)
          console.log(error);
        else{
        console.log("Success");
        document.querySelector('.button').innerHTML = "Success";
        setTimeout(function(){
        window.location.replace('/listStudent');
        },300);
      }
      });  
  }

});


if (Meteor.isServer) {
  Meteor.publish('student', function () {
    return Students.find();
  });

  Meteor.publish('adder', function (filter) {
    return Students.find(filter || {});
  });
}