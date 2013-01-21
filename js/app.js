---
---
// dashes above allow this file to be processed by jekyll

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

window.Game = {
  Model: {},
  View: {},
  Router: {}
}

window.Game.View.UI = Backbone.View.extend({
  className: "game",
  
  template: _.template( $("#game-ui-template").html() ),
  
  events: {
    "click .music": "music",
    "click .about-jump-buds": "about",
    "click .close": "closeAbout"
  },
  
  initialize: function() {
    // {{ site.baseurl }} places the base url of this site when this file is processed by jekyll
    this.song = new buzz.sound( "{{ site.baseurl }}/sounds/song1", { formats: [ "mp3", "wav" ] });
    this.song.play().fadeIn().loop();
  },
  
  music: function(){
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
  
  about: function(){
    this.$el.find('.about').toggle();
  },
  
  closeAbout: function(){
    this.$el.find('.about').hide();
  },
  
  render: function() {
    this.$el.html( this.template() );
    
    $('body').prepend( this.$el );
    return this;
  }
})


window.Game.Model.Jumper = Backbone.Model.extend({
  defaults: {
    width: 36,
    height: 68,
    speed: 50,
    delay: 0,
    poops: 0
  }
});

window.Game.View.Jumper = Backbone.View.extend({
  className: "jumper",
  keysDown: {},
  
  initialize: function() {
    _.bindAll(this, "keyDownHandler");
    $(document).on('keydown', this.keyDownHandler);
    
    _.bindAll(this, "keyUpHandler");
    $(document).on('keyup', this.keyUpHandler);
    
    $(".game").append( this.$el );
    this.$el.delay(500).animate({ bottom: 40, left: 80 }, 1000);
  },
  
  events: {},
  
  keyDownHandler: function(e) {
    
    var $el = this.$el;
    var jumper = this.model.attributes;
    
    this.keysDown[e.keyCode] = true;
        
    if (40 in this.keysDown) {}
    
    if (38 in this.keysDown && 39 in this.keysDown) {
      // jump right
      this.animate('right', jumper.speed, true, 'jump', 'left');
    } 
    
    else if (37 in this.keysDown && 38 in this.keysDown) {
      // jump left
      this.animate('left', jumper.speed, true, 'jump left', '');
    } 
    
    else if (38 in this.keysDown) {
      //jump straight up
      this.animate('none', jumper.speed, true, 'jump', '');
    }
    
    if (39 in this.keysDown) {
      //walk right
      this.animate('right', jumper.speed, false, 'walk', 'left');
    }
    
    if (37 in this.keysDown) {
      //walk left
      this.animate('left', jumper.speed, false, 'walk left', '');
    }
    
    if (80 in this.keysDown) {
      $el.addClass('pooping');
      
      var buttLocation;
      if ( $(".jumper").hasClass("left") ){
        buttLocation = 20
      } else {
        buttLocation = 10
      }
      
      var poop = new Game.Model.Poop({
        pooper: this,
        x: parseInt( $el.css("left") ) + buttLocation,
        y: parseInt( $el.css("bottom") ) + 20
      });
      
      var poopView = new Game.View.Poop({ model: poop });
      poopView.render();
    }
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keydown', this.keyUpHandler);
    }
  },
  
  keyUpHandler: function(e){
    delete this.keysDown[e.keyCode];
    
    this.$el.removeClass('walk pooping');
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keyup', this.keyUpHandler);
    }
  },
  
  animate: function(xdir, speed, jump, addclasses, removeclasses){
    var $el = this.$el;
    var dir;
    var xspeed = speed;
    
    if (xdir === 'left'){
      dir = '-=';
    } else if (xdir === 'right'){
      dir = '+=';
    } else {
      dir = '';
      xspeed = null;
    }
    
    var jumpForce = (jump === true) ? speed * 2 : 0;
    
    $el
      .addClass(addclasses)
      .removeClass(removeclasses)
      .animate({
        left: dir + xspeed,
        bottom: '+=' + jumpForce
      }, 120, 'swing', function(){

      })
      .animate({
        left: dir + xspeed,
        bottom: '-=' + jumpForce
      }, 80, 'swing', function(){
        if ($(this).hasClass('jump')){
          $(this).removeClass('jump');
        }
        $el.clearQueue();
        $el.stop();
      });
  },
  
  render: function(){
    return this;
  }

});

window.Game.Model.NPC = Backbone.Model.extend()
window.Game.View.NPC = Backbone.View.extend({
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
    var $el = this.$el;
    console.log("oooh, random");
    $el
      .delay( getRandom(0, 1000) )
      .animate({ bottom: getRandom(40, 80), left: getRandom(300, 400) }, 900)
      .animate({bottom: 40}, 700, 'swing', function(){
        console.log("random actually ran");
      });
  },
  
  render: function(){
    $(".game").append( this.$el );
    this.$el.delay(4000).animate({ bottom: 40, left: 400 }, 2000);
    return this;
  }
})

window.Game.Model.Slime = Game.Model.NPC.extend();
window.Game.View.Slime = Game.View.NPC.extend();

window.Game.Model.Poop = Backbone.Model.extend({
  defaults: {
    pooper: null,
    x: 0,
    y: 0
  }
});

window.Game.View.Poop = Backbone.View.extend({
  className: 'poop',
  
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
});

window.Game.Router.Main = Backbone.Router.extend({
  
  start: function(){
    this.gameView = new Game.View.UI;
    this.gameView.render();
    
    this.jumper = new Game.Model.Jumper({ speed: 40 });
    this.jumperView = new Game.View.Jumper({ model: this.jumper });
    this.jumperView.render();
    
    this.slime = new Game.Model.Slime;
    this.slimeView = new Game.View.Slime;
    this.slimeView.render();
  },
  
  input: function(){
  
  },
  
  draw: function(){
    this.slimeView.randomMovement();
  }

});

var game = new Game.Router.Main;
game.start();

var fps = 30;
var lastRun = new Date().getTime();
  
function tick(){
  var now = new Date().getTime();
  if ( (now - lastRun) > (1000 / fps) ){
    
    game.input();
    game.draw();
    
    lastRun = new Date().getTime();
  }
  
  requestAnimationFrame( tick );
}
  
tick();
