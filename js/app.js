---
---
var Game = Backbone.Model.extend({
  
});

Game.GameView = Backbone.View.extend({
  className: "game",
  
  events: {
    "click .music": "music"
  },
  
  music: function() {
    $('.music').click(function(){
      if ( $(this).hasClass('paused') ) {
        $(this).removeClass('paused');
      } else {
        $(this).addClass('paused');
      }
    });
  },
  
  render: function() {
    $('body').prepend( this.$el );
    this.$el.append('<span class="music">pause music</span>');
    return this;
  }
})


Game.Jumper = Backbone.Model.extend({
  defaults: {
    width: 36,
    height: 68,
    speed: 30,
    x: 10,
    y: 0
  }
});

Game.JumperView = Backbone.View.extend({
  className: "jumper",
  keysDown: {},
  
  initialize: function() {
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
    var jumper = this.model.attributes;
    
    this.keysDown[e.keyCode] = true;
    
    if (40 in this.keysDown) {}
    
    if (38 in this.keysDown && 39 in this.keysDown) {
      this.$el.addClass("jump").removeClass('left').animate({
        bottom: '+=' + jumper.speed*2,
        left: '+=' + jumper.speed*2
      }, 120, function() {
        
      }).animate({
        bottom: '-=' + jumper.speed*2,
        left: '+=' + jumper.speed*2
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown && 37 in this.keysDown) {
      this.$el.addClass("jump").animate({
        bottom: '+=' + jumper.speed*2,
        left: '-=' + jumper.speed*2
      }, 120, function() {
        
      }).animate({
        bottom: '-=' + jumper.speed*2,
        left: '-=' + jumper.speed*2
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown) {
      this.$el.addClass("jump").animate({
        bottom: '+=' + jumper.speed*2
      }, 120, function() {
        
      }).animate({
        bottom: '-=' + jumper.speed*2
      }, 80, function() {
        
      });
    }
    
    if (39 in this.keysDown) {
      this.$el.addClass('walk').removeClass('left').animate({
        left: '+=' + jumper.speed
      }, 100, function() {
      });
    }
    
    if (37 in this.keysDown) {
      this.$el.addClass('left walk').animate({
        left: '-=' + jumper.speed
      }, 100, function() {
      });
    }
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keydown', this.keyUpHandler);
    }
  },
  
  keyUpHandler: function(e) {
    delete this.keysDown[e.keyCode];
    this.$el.removeClass('walk jump');
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keyup', this.keyUpHandler);
    }
  },
  
  render: function() {
    $(".game").append( this.$el );
    this.$el.delay(500).animate({ bottom: 0 }, 1000);
    return this;
  }

});

Game.Router = Backbone.Router.extend({
  
  start: function() {
    $('.not-supported').hide();
    
    this.game = new Game;
    this.gameView = new Game.GameView({ model: this.game });
    this.gameView.render();
    
    this.jumper = new Game.Jumper;
    this.jumperView = new Game.JumperView({ model: this.jumper });
    this.jumperView.render();
    
    var song = new buzz.sound( "{{ site.baseurl }}/sounds/song1", {
      formats: [ "mp3", "wav" ]
    });
    song.play().fadeIn().loop();
  }
  
});

var game = new Game;
var gameRouter = new Game.Router({ model: game });
gameRouter.start();
