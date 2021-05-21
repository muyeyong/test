<template>
  <div id="app">
    <ul class="imgs">
      <li v-for=" i in wrapMaxCount" :key="i" v-visible.once="loadImg" class="img-item" ></li>
    </ul>
    <div  v-visible = "loadMore" class="observer"></div>
  </div>
</template>

<script>
import visible from './directives/visible'

export default {
  name: "App",
  components: {},
  directives: {
    visible,
  },
  data(){
    return {
      maxCount: 11,
      currIndex: 0,
      wrapMaxCount: 11
    }
  },
  mounted() {
    this.getImg()
  },
  methods: {
    getImg(i){
     if(typeof i === 'number')
      return require(`./assets/demo${i}.jpg`)
    },
    loadImg(e){
      const index = this.currIndex % this.maxCount
      const elImg = document.createElement('img')
      elImg.src =  this.getImg(index)
      e.appendChild(elImg)
      this.currIndex += 1
    },
    loadMore(){
      console.log('loadMore')
     this.wrapMaxCount += 5
    },
    fetch(){

    },
    smartNav(elements, options) {
      var defaults = {
        nav: null,
      };
      var params = Object.assign({}, defaults, options || {});

      if (typeof elements == "string") {
        elements = document.querySelectorAll(elements);
      }
      if (!elements.forEach) {
        return;
      }
      // 导航元素创建，如果没有
      if (!params.nav) {
        params.nav = document.createElement("div");
        params.nav.className = "title-nav-ul";
        document.body.appendChild(params.nav);
      }

      var lastScrollTop = document.scrollingElement.scrollTop;

      var zxxObserver = new IntersectionObserver(function (entries) {
        if (params.isAvoid) {
          return;
        }
        entries.reverse().forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.active();
          } else if (entry.target.isActived) {
            entry.target.unactive();
          }
        });

        lastScrollTop = document.scrollingElement.scrollTop;
      });

      elements.forEach(function (ele, index) {
        var id = ele.id || ("smartNav" + Math.random()).replace("0.", "");
        ele.id = id;
        // 导航元素创建
        var eleNav = document.createElement("a");
        eleNav.href = "#" + id;
        eleNav.className = "title-nav-li";
        eleNav.innerHTML = ele.textContent;
        params.nav.appendChild(eleNav);
        ele.active = function () {
          // 对应的导航元素高亮
          eleNav.parentElement
            .querySelectorAll(".active")
            .forEach(function (eleActive) {
              ele.isActived = false;
              eleActive.classList.remove("active");
            });
          eleNav.classList.add("active");
          ele.isActived = true;
        };
        ele.unactive = function () {
          // 对应的导航元素高亮
          if (document.scrollingElement.scrollTop > lastScrollTop) {
            elements[index + 1] && elements[index + 1].active();
          } else {
            elements[index - 1] && elements[index - 1].active();
          }
          eleNav.classList.remove("active");
          ele.isActived = false;
        };

        // 观察元素
        zxxObserver.observe(ele);
      });

      params.nav.addEventListener("click", function (event) {
        var eleLink = event.target.closest("a");
        // 导航对应的标题元素
        var eleTarget =
          eleLink && document.querySelector(eleLink.getAttribute("href"));
        if (eleTarget) {
          event.preventDefault();
          // Safari不支持平滑滚动
          eleTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          if (CSS.supports("scroll-behavior: smooth")) {
            params.isAvoid = true;
            setTimeout(function () {
              eleTarget.active();
              params.isAvoid = false;
            }, Math.abs(
              eleTarget.getBoundingClientRect().top - window.innerHeight / 2
            ) / 2);
          } else {
            eleTarget.active();
          }
        }
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.imgs{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem auto;
}
.img-item{
  width: 31.25rem;
  height: 31.25rem;
  list-style: none;
}
.img-item img{
  width: 100%;
  height: 100%;
}


</style>
