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
      this.$el.addClass('pooping');
      
      var buttLocation;
      if ( $(".jumper").hasClass("left") ){
        buttLocation = 20
      } else {
        buttLocation = 10
      }
      
      var poop = new Game.Poop({
        x: parseInt( this.$el.css("left") ) + buttLocation,
        y: parseInt( this.$el.css("bottom") ) + 20
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
    this.$el.removeClass('walk jump pooping');
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keyup', this.keyUpHandler);
    }
  },
  
  render: function() {
    $(".game").append( this.$el );
    this.$el.delay(500).animate({ bottom: 40, left: getRandom(0, $(window).width()-36) }, 1000);
    return this;
  }

});

Game.NPC = Backbone.Model.extend({

})

Game.NPCView = Backbone.View.extend({
  className: 'npc',
  
  events: {
    'click': 'npcClick'
  },
  
  npcClick: function(){    
    this.$el.addClass("clicked");
    
    var self = this;
    setTimeout(function() {
      self.$el.removeClass("clicked");
    }, 800);
  },
  
  randomMovement: function(){
    this.$el
      .delay( getRandom(0, 1000) )
      .animate({ bottom: getRandom(40, 80), left: getRandom(300, 400) }, 2000)
      .animate({bottom: 40});
  },
  
  render: function(){
    $(".game").append( this.$el );
    this.$el.delay(4000).animate({ bottom: 40, left: 400 }, 2000);
    return this;
  }
})

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
    $(".game").append(this.$el);
    this.$el.css({
      left: poop.x,
      bottom: poop.y
    });
    
    var poopDirection;
    if ( $(".jumper").hasClass("left") ){
      poopDirection = '+=15px';
    } else {
      poopDirection = '-=15px';
    }
    
    this.$el.animate({
      left: poopDirection,
      bottom: '40px'
    }, 300, 'swing');
  
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
    var npcs = 0;
    var $poops;
    
    function tick() {	
      now = (new Date).getTime();
      
      if(now - lastFrameTimestamp > interval) {
        lastFrameTimestamp = now;
        
        if (jumpers < 10) {
          this.jumper = new Game.Jumper({ speed: getRandom(0, 100), delay: getRandom(0, 10) });
          this.jumperView = new Game.JumperView({ model: this.jumper });
          this.jumperView.render();
          jumpers++;        
        }
        
        // start cleaning up the poop eventually.
        $poops = $(".poop");
        if ( $poops.length > 10 ){
          $poops[0].remove();
        }
                
        if (npcs < 1){
          this.npc = new Game.NPC;
          this.npcView = new Game.NPCView;
          this.npcView.render();
          npcs++;
        }
        
        this.npcView.randomMovement();
        
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