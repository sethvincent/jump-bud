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
    y: 0,
    poops: 0
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
    
    if (80 in this.keysDown) {
      var poop = new Game.Poop({
        x: this.$el.css("left"),
        y: this.$el.css("bottom")
      });
      var poopView = new Game.PoopView({ model: poop });
      poopView.render();
      
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

Game.Poop = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0
  }
});

Game.PoopView = Backbone.View.extend({
  className: 'poop',
  
  initialize: function(){
  
  },
  
  render: function(){
    var poop = this.model.attributes;
    console.log(poop);
    $(".game").append(this.$el);
    this.$el.css({
      left: poop.x,
      bottom: poop.y
    });
    this.$el.css({
      bottom: '+= 40'
    });
  }
})

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
    
    var fps = 1;
    var now = lastFrameTimestamp = (new Date).getTime();
    var interval = 1000 / fps;
    var jumpers = 0;
    var poops;
    
    function tick() {	
      now = (new Date).getTime();
      
      if(now - lastFrameTimestamp > interval && jumpers < 10) {
        lastFrameTimestamp = now;
        
        if (jumpers < 10) {
          this.jumper = new Game.Jumper({ speed: getRandom(0, 100), delay: getRandom(0, 10) });
          this.jumperView = new Game.JumperView({ model: this.jumper });
          this.jumperView.render();
        
          jumpers++;        
        }
        
        poops = $(".poop");
        
        if ( poops.length > 0 ){
        
        }

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