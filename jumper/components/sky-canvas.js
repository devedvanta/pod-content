AFRAME.registerComponent('sky-canvas', {
    schema: {default: ''},

    init: function () {
      console.log("InCanvas REady");
      var canvas = this.canvas = document.getElementById(this.data);
      var ctx = this.ctx = this.canvas.getContext('2d');
        var xMax = this.canvas.width = window.screen.availWidth;
        var yMax = this.canvas.height = window.screen.availHeight;
          this.color = 'rgba(255, 255, 255, 1)';
          this.minRadius = 0.5;
          this.maxRadius = 1.5;
          this.minSpeed = .1;
          this.maxSpeed = .5;
          this.fps = 60;
          this.numStars = 400;
          this.render();
          this.createCircle();
      },

      _rand: function (min, max) {
          return Math.random() * (max - min) + min;
      },

      render: function () {
          var self = this,
              wHeight = window.innerHeight,
              wWidth = window.innerWidth;

          self.canvas.width = wWidth;
          self.canvas.height = wHeight;

          window.addEventListener('resize', self.render);
      }
      ,
      //Create shape
      createCircle: function () {
          var star = [];

          for (var i = 0; i < this.numStars; i++) {
              var self = this;
              star[i] = {
                  radius: self._rand(self.minRadius, self.maxRadius),
                  xPos: self._rand(0, self.canvas.width),
                  yPos: self._rand(0, self.canvas.height),
                  xVelocity: self._rand(self.minSpeed, self.maxSpeed),
                  yVelocity: self._rand(self.minSpeed, self.maxSpeed),
                  color: self.color
              }

              //once values are determined, draw star on canvas
              self.draw(star, i);
          }
          //...and once drawn, animate the star
          self.animate(star);
      }
      ,
     // Draw the stars on canvas
      draw: function (star, i) {
          var self = this,
              ctx = self.ctx;
              ctx.fillStyle = star[i].color;

          ctx.beginPath();
          ctx.arc(star[i].xPos, star[i].yPos, star[i].radius, 0, 2 * Math.PI, false);
          ctx.fill();
          this.updateTexture();
      }
      ,
      // Animate stars from right to left
      animate: function (star) {
          var self = this,
              ctx = self.ctx;

          setInterval(function () {
              //clears canvas
              self.clearCanvas();
              //redraws stars
              for (var i = 0; i < self.numStars; i++) {
                  star[i].xPos -= star[i].xVelocity;
                  //if star goes off screen from the left call reset method
                  if (star[i].xPos < 0) {
                      self.resetStar(star, i);
                  }
                  else{
                      self.draw(star, i);
                  }
              }
          }, 1000 / self.fps);
      }
      ,
      // reset the star xPos with a randon YPos 
      resetStar: function (star, i) {
          var self = this;
          star[i].xPos +=  self.canvas.width + star[i].radius;
          star[i].yPos = self._rand(0, self.canvas.height);
          self.draw(star, i);
      },

      clearCanvas: function () {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
  });

  