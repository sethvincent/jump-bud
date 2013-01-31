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
  keys: {},
  
  initialize: function() {
    _.bindAll(this, "keyDownHandler");
    $(document).on('keydown', this.keyDownHandler);
    
    _.bindAll(this, "keyUpHandler");
    $(document).on('keyup', this.keyUpHandler);
    
    $(".game").append( this.$el );
    this.$el.delay(500).animate({ bottom: 40, left: 80 }, 1000);
  },
  
  keyDownHandler: function(e) {
    this.keys[e.keyCode] = true;
    
    if($(document).find($(this.el)).size() <= 0) {
      $(document).unbind('keydown', this.keyUpHandler);
    }
  },
  
  keyUpHandler: function(e){
    delete this.keys[e.keyCode];
    
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
    
    var jumpForce = 0;
    var animationSpeed = 30;
    
    if ( jump === true ) {
      jumpForce = speed * 4;
      animationSpeed = 80;
      
      if (xspeed !== null){
        xspeed = xspeed*4;
      }
    }
    
    $el
      .addClass(addclasses)
      .removeClass(removeclasses)
      .animate({
        left: dir + xspeed,
        bottom: '+=' + jumpForce
      }, animationSpeed, 'swing')
      .animate({
        left: dir + xspeed,
        bottom: '-=' + jumpForce
      }, animationSpeed, 'swing', function(){
        if ($(this).hasClass('jump')){
          $(this).removeClass('jump');
        }
        $el.clearQueue();
        $el.stop();
      });
  },
  
  render: function(){
    var $el = this.$el;
    var jumper = this.model.attributes;
    
    jumper.x = parseInt( $el.css("left") );
    
    if ( jumper.x <= 0 ){
      $el.css({ left: 0 });
    }
    if ( jumper.x >= $(window).width() - jumper.width ){
      $el.css({ left: $(window).width() - jumper.width });
    }
    
    for (var direction in this.keys) {
      if (!this.keys.hasOwnProperty(direction)){
        continue;
      }
      
      // jump left
      if (38 in this.keys && 37 in this.keys) {
        this.animate('left', jumper.speed, true, 'jump left', ''); 
      }
      
      // jump right
      if (38 in this.keys && 39 in this.keys) {
        this.animate('right', jumper.speed, true, 'jump', 'left'); 
      }
      
      // jump straight up
      if (38 in this.keys) {
        this.animate('none', jumper.speed, true, 'jump', ''); 
      }
      
      // walk left
      if (37 in this.keys) {
        this.animate('left', jumper.speed, false, 'walk left', '');             
      }
      
      // walk right
      if (39 in this.keys) {
        this.animate('right', jumper.speed, false, 'walk', 'left'); 
      }
      
      // maybe eventually pushing down will do something
      if (40 in this.keys) {}
      
      // poop, bud.
      if (80 in this.keys) {
        $el.addClass('pooping');
        
        var self = this;
        $(document).mousemove(function(e){
          self.mouseX = e.pageX;
          self.mouseY = e.pageY;
        });
        console.log("mouse position", this.mouseX, this.mouseY)
        
        if (this.mouseX > parseInt($el.css("left"))){
          $el.addClass('left').removeClass('right');
        } else {
          $el.addClass('right').removeClass('left');
        }
        
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
        

        poopView.render(this.mouseX, this.mouseY);
        
      }
    }
    return this;
  }

});

window.Game.Model.NPC = Backbone.Model.extend();
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
    $el
      .delay( getRandom(0, 1000) )
      .animate({ bottom: getRandom(40, 80), left: getRandom(300, 400) }, 900)
      .animate({bottom: 40}, 700, 'swing', function(){});
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
  
  render: function(mouseX, mouseY){
    var poop = this.model.attributes;
    $(".game").append(this.$el);
    this.$el.css({
      left: poop.x,
      bottom: poop.y
    });
    
    /*
    var poopDirection;
    if ( $(".jumper").hasClass("left") ){
      poopDirection = '+=15px';
    } else {
      poopDirection = '-=15px';
    }
    */
    
    this.$el.animate({
      left: mouseX,
      bottom: $(window).height() - mouseY
    }, 400, 'swing')
    .animate({
      bottom: '40px'
    });
  }
});

window.Game.Router.Main = Backbone.Router.extend({
  
  start: function(){
    this.gameView = new Game.View.UI;
    this.gameView.render();
    
    this.jumper = new Game.Model.Jumper({ speed: 20 });
    this.jumperView = new Game.View.Jumper({ model: this.jumper });
    this.jumperView.render();
    
    this.slime = new Game.Model.Slime;
    this.slimeView = new Game.View.Slime;
    this.slimeView.render();
  },
  
  draw: function(){
    this.slimeView.randomMovement();
    this.jumperView.render()
  }

});

var game = new Game.Router.Main;
game.start();

var fps = 60;
var lastRun = new Date().getTime();
  
function tick(){
  var now = new Date().getTime();
  if ( (now - lastRun) > (1000 / fps) ){
    
    game.draw();
    
    lastRun = new Date().getTime();
  }
  
  requestAnimationFrame( tick );
}
  
tick();

