var processor;
window.onload = function(){
    function doLoad() {
        this.video = document.getElementById('sourceVideo');
        this.c1 = document.getElementById('c1');
        this.ctx1 = this.c1.getContext('2d');
        this.c2 = document.getElementById('c2');
        this.ctx2 = this.c2.getContext('2d');
        let self = this;
        this.video.onloadeddata = ()=>{
          self.width = self.video.videoWidth /4;
          self.height = self.video.videoHeight/4 ;
          timerCallback();
          canvas2video(this.c1)
        }
        // this.video.addEventListener('play', function() {
        //     self.width = self.video.videoWidth /4;
        //     self.height = self.video.videoHeight/4 ;
        //     timerCallback();
        //   }, false);
      }
      function timerCallback() {
          // if (this.video.paused || this.video.ended) {
          //   return;
          // }
          computeFrame();
          requestAnimationFrame(timerCallback)
          // let self = this;
          // setTimeout(function() {
          //     timerCallback();
          //   }, 0);
        }
        function computeFrame() {
          this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
          // resample_single(ctx1,ctx2,this.width,this.height,false)
          // canvas2video(this.c1)
          // let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
          // let l = frame.data.length / 4;
      
          // for (let i = 0; i < l; i++) {
          //   let r = frame.data[i * 4 + 0];
          //   let g = frame.data[i * 4 + 1];
          //   let b = frame.data[i * 4 + 2];
          //   frame.data[i*4 +0] = r^255
          //   frame.data[i*4 +1] = g^255
          //   frame.data[i*4 +2] = b^255
          //   // if (g > 100 && r > 100 && b < 43)
          //   //   frame.data[i * 4 + 3] = 0;
          // }
          // this.ctx2.putImageData(frame, 0, 0);
          // return;
        }
        function resample_single(ctx1,ctx2, width, height) {
          var width_source = this.width;
          var height_source = this.height;
          width = Math.round(width);
          height = Math.round(height);
          var ratio_w = width_source / width;
          var ratio_h = height_source / height;
          var ratio_w_half = Math.ceil(ratio_w / 2);
          var ratio_h_half = Math.ceil(ratio_h / 2);
          
          var img = ctx1.getImageData(0, 0, width_source, height_source);
          var img2 = ctx2.createImageData(width, height);
          var data = img.data;
          var data2 = img2.data;
      
          for (var j = 0; j < height; j++) {
              for (var i = 0; i < width; i++) {
                  var x2 = (i + j * width) * 4;
                  var weight = 0;
                  var weights = 0;
                  var weights_alpha = 0;
                  var gx_r = 0;
                  var gx_g = 0;
                  var gx_b = 0;
                  var gx_a = 0;
                  var center_y = (j + 0.5) * ratio_h;
                  var yy_start = Math.floor(j * ratio_h);
                  var yy_stop = Math.ceil((j + 1) * ratio_h);
                  for (var yy = yy_start; yy < yy_stop; yy++) {
                      var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                      var center_x = (i + 0.5) * ratio_w;
                      var w0 = dy * dy; //pre-calc part of w
                      var xx_start = Math.floor(i * ratio_w);
                      var xx_stop = Math.ceil((i + 1) * ratio_w);
                      for (var xx = xx_start; xx < xx_stop; xx++) {
                          var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                          var w = Math.sqrt(w0 + dx * dx);
                          if (w >= 1) {
                              //pixel too far
                              continue;
                          }
                          //hermite filter
                          weight = 2 * w * w * w - 3 * w * w + 1;
                          var pos_x = 4 * (xx + yy * width_source);
                          //alpha
                          gx_a += weight * data[pos_x + 3];
                          weights_alpha += weight;
                          //colors
                          if (data[pos_x + 3] < 255)
                              weight = weight * data[pos_x + 3] / 250;
                          gx_r += weight * data[pos_x];
                          gx_g += weight * data[pos_x + 1];
                          gx_b += weight * data[pos_x + 2];
                          weights += weight;
                      }
                  }
                  data2[x2] = gx_r / weights;
                  data2[x2 + 1] = gx_g / weights;
                  data2[x2 + 2] = gx_b / weights;
                  data2[x2 + 3] = gx_a / weights_alpha;
              }
          }
          //clear and resize canvas
          // if (resize_canvas === true) {
          //     canvas.width = width;
          //     canvas.height = height;
          // } else {
          //     ctx.clearRect(0, 0, width_source, height_source);
          // }
      
          //draw
          ctx2.putImageData(img2, 0, 0);
         
      }
      function canvas2video(canvas){
        const stream = canvas.captureStream();
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const data = [];
        recorder.ondataavailable = function (event) {
          if (event.data && event.data.size) {
            data.push(event.data);
          }
        };
        recorder.onstop = () => {
          const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));
          document.querySelector("#videoContainer").style.display = "block";
          document.querySelector("#videoContainer video").src = url;
        };
        recorder.start();
        setTimeout(() => {
          recorder.stop();
        }, 11000);
      }
        doLoad()    
}
