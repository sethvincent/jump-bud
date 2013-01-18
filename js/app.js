---
---
// dashes above allow this file to be processed by jekyll

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var Game = Backbone.Model.extend({
  
});

Game.GameView = Backbone.View.extend({
  className: "game",
  
  template: _.template( $("#game-ui-template").html() ),
  
  events: {
    "click .music": "music"
  },
  
  initialize: function() {
    // {{ site.baseurl }} places the base url of this site when this file is processed by jekyll
    this.song = new buzz.sound( "{{ site.baseurl }}/sounds/song1", { formats: [ "mp3", "wav" ] });
    this.song.play().fadeIn().loop();
  },
  
  music: function(e) {
    var $music = this.$el.find('.music');
        
    if ( $music.hasClass('paused') ) {
      $music.removeClass('paused');
      $music.html('pause music');
      this.song.play().loop();
    } else {
      $music.addClass('paused');
      $music.html('play music');
      this.song.pause();
    }
  },
  
  render: function() {
    this.$el.html( this.template() );
    
    $('body').prepend( this.$el );
    return this;
  }
})


Game.Jumper = Backbone.Model.extend({
  defaults: {
    width: 36,
    height: 68,
    speed: getRandom(10, 100),
    delay: getRandom(10, 100),
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
    //"keypress": "keyDownHandler",
    //"keyup": "keyUpHandler"
  },
  
  keyDownHandler: function(e) {
    
    var jumper = this.model.attributes;
    
    this.keysDown[e.keyCode] = true;
    console.log(jumper.speed);
    
    if (40 in this.keysDown) {}
    
    if (38 in this.keysDown && 39 in this.keysDown) {
      this.$el.addClass("jump").removeClass('left').delay(jumper.delay).animate({
        bottom: '+=' + jumper.speed*2,
        left: '+=' + jumper.speed*2
      }, 120, function() {
        
      }).animate({
        bottom: '-=' + jumper.speed*2,
        left: '+=' + jumper.speed*2
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown && 37 in this.keysDown) {
      this.$el.addClass("jump").delay(jumper.delay).animate({
        bottom: '+=' + jumper.speed*2,
        left: '-=' + jumper.speed*2
      }, 120, function() {
        
      }).animate({
        bottom: '-=' + jumper.speed*2,
        left: '-=' + jumper.speed*2
      }, 80, function() {
        
      });
    } else if (38 in this.keysDown) {
      this.$el.addClass("jump").delay(jumper.delay).animate({
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
    this.$el.delay(500).animate({ bottom: 40, left: getRandom(0, 1000) }, 1000);
    return this;
  }

});

Game.Router = Backbone.Router.extend({
  
  start: function() {    
    this.game = new Game;
    this.gameView = new Game.GameView({ model: this.game });
    this.gameView.render();
    
    this.jumper = new Game.Jumper({ speed: getRandom(40, 100), delay: getRandom(100, 1000) });
    this.jumperView = new Game.JumperView({ model: this.jumper });
    this.jumperView.render();
  },
  
  loop: function() {
    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
    })();
    
    fps = 1;
    now = lastFrameTimestamp = (new Date).getTime();
    interval = 1000 / fps;
    counter = 0;
    
    function tick() {	
      now = (new Date).getTime();
      if(now - lastFrameTimestamp > interval) {
        lastFrameTimestamp = now;

        this.jumper = new Game.Jumper({ speed: getRandom(40, 100), delay: getRandom(100, 1000) });
        this.jumperView = new Game.JumperView({ model: this.jumper });
        this.jumperView.render();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  
});

var game = new Game;
var gameRouter = new Game.Router({ model: game });
gameRouter.start();
gameRouter.loop();


