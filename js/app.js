var Game = Backbone.Model.extend({
  // this will matter soon.
});


Game.Jumper = Backbone.Model.extend({
  defaults: {
    width: 36,
    height: 68,
    speed: 5,
    x: 10,
    y: 0
  }
});

Game.JumperView = Backbone.View.extend({
  className: "jumper",
  keysDown: {},
  
  initialize: function() {
    console.log("jumper view: initialize");
    _.bindAll(this, "keyDownHandler");
    $(document).bind('keydown', this.keyDownHandler);
    
    _.bindAll(this, "keyUpHandler");
    $(document).bind('keyup', this.keyUpHandler);
  },
  
  events: {
    "keydown": "keyDownHandler",
    "keyup": "keyUpHandler"
  },
  
  keyDownHandler: function(e) {
    
    this.keysDown[e.keyCode] = true;
    console.log(this.keysDown);
    
    if (40 in this.keysDown) {}
    
    if (38 in this.keysDown && 39 in this.keysDown) {
      console.log("yep");
      this.$el.removeClass('left').animate({
        bottom: '+=50',
        left: '+=50'
      }, 120, function() {
        
      }).animate({
        bottom: '-=50',
        left: '+=50'
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown && 37 in this.keysDown) {
      console.log("yep");
      this.$el.animate({
        bottom: '+=50',
        left: '-=50'
      }, 120, function() {
        
      }).animate({
        bottom: '-=50',
        left: '-=50'
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown) {
      this.$el.animate({
        bottom: '+=50'
      }, 120, function() {
        
      }).animate({
        bottom: '-=50'
      }, 80, function() {
        
      });
    }
    
    if (37 in this.keysDown) {
    
      this.$el.addClass('left walk').animate({
        left: '-=30'
      }, 100, function() {
        console.log("huh");
      });
    }
    
    if (39 in this.keysDown) {
      this.$el.addClass('walk').removeClass('left').animate({
        left: '+=30'
      }, 100, function() {
        console.log("huh");
      });
    }
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keydown', this.keyUpHandler);
    }
  },
  
  keyUpHandler: function(e) {
    delete this.keysDown[e.keyCode];
    this.$el.removeClass('walk');
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keyup', this.keyUpHandler);
    }
  },
  
  render: function() {
    var self = this;
    $("#game").html( this.$el );
    this.$el.delay(500).animate({ bottom: 0 }, 1000);
    return this;
  }

});

Game.Router = Backbone.Router.extend({
  
  start: function() {
    this.jumper = new Game.Jumper
    this.jumperView = new Game.JumperView({ model: this.jumper });
    this.jumperView.render();
  }
  
});

var game = new Game;
var gameRouter = new Game.Router({ model: game });
gameRouter.start();
