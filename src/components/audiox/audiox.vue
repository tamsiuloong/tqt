<template>
  <div class="container_box" style="height: 150px" id="audio_detail">
    <div>
      <audio autoplay="autoplay" id="audioPlayer" preload="auto" :src="audioSrc">
        你的浏览器不支持audio标签
      </audio>
      <div class="audioBox">
        <div class="audioBox_top">
          <div class="audioBox_left">
            {{audioCurrentTime}}
          </div>
          <div class="audioBox_slider">
            <van-slider v-model="audioTime" @change="onChange" bar-height="4px"/>
          </div>
          <div class="audioBox_right">
            {{audioAllTime}}
          </div>
          <div class="clear"></div>
        </div>
        <div class="audioBox_control">
          <div>
            <!--播放按钮-->
            <i class="iconfont icon-bofang1 iconfont_control" @click="playAudio" v-show="!isPlay" ><Icon type="md-play" /></i>
              <!--暂停按钮-->
            <i class="iconfont icon-zanting iconfont_control" @click="pauseAudio" v-show="isPlay"><Icon type="md-pause" /></i>
          </div>
          <!--设置倍速播放-->
          <div class="audioBox_multiple" >
            <div>
            <i class="iconfont icon-zanting iconfont_control" @click="changeMultiple('reduce')" ><Icon type="ios-arrow-dropleft" /></i>
            <i class="iconfont icon-zanting iconfont_control" @click="changeMultiple('add')" ><Icon type="ios-arrow-dropright" /></i>
            </div>
            <i  style="font-size: large">{{multipleArray[multipleIndex]}}X</i>
          </div>
        </div>

      </div>


    </div>

  </div>
</template>
<script>
  import 'vant/lib/index.css';
  let audioInterval;
  export default {
    name: 'audio',
    props: {
      audioSrc:String
    },
    data () {

      return {
        audioTime:0,//音频进度百分比
        audioCurrentTime:'00:00',//音频当前播放时间
        audioAllTime:'00:00',//音频总播放时间
        audioAllDuration:0,//音频总播放秒数
        isPlay:false,//是否正在播放
        multipleArray:[0.75,1,1.5,2,2.5,3],
        multipleIndex:1,
      }
    },
    computed: {


    },
    methods: {
      //设置定时检测
      setAudioInterval(){
        audioInterval = setInterval(()=>{
          this.getAudioTime();
          let audioPlayer = document.getElementById('audioPlayer');
          if(audioPlayer.ended){
            //播放结束后重置数据
            clearInterval(audioInterval);
            this.audioTime=0;
            audioPlayer.currentTime = 0;
            this.audioCurrentTime='00:00';
            this.isPlay=false;
          }
          audioPlayer.paused?this.isPlay=false:this.isPlay=true
        },500)
      },
      //播放
      playAudio(){
        //重设定时器
        clearInterval(audioInterval);
        this.getAudioTime();
        this.setAudioInterval();
        document.getElementById('audioPlayer').play();
        this.isPlay=true;
      },
      //暂停
      pauseAudio(){
        document.getElementById('audioPlayer').pause();
        this.isPlay=false;
      },
      //获取播放时间
      getAudioTime(){
        let audioPlayer = document.getElementById('audioPlayer');
        // console.log("播放总时间--"+realFormatSecond(audioPlayer.duration));
        // console.log("已播放秒数--"+realFormatSecond(audioPlayer.currentTime));
        //展示用
        this.audioAllTime = realFormatSecond(audioPlayer.duration);
        this.audioAllDuration = audioPlayer.duration;
        this.audioCurrentTime = realFormatSecond(audioPlayer.currentTime);
        //计算当前进度百分比
        this.audioTime = (audioPlayer.currentTime*100/audioPlayer.duration).toFixed(3);
        // console.log("百分比--"+this.audioTime)
      },
      //滑动进度条
      onChange(value){
        // 设置播放时间
        let audioPlayer = document.getElementById('audioPlayer');
        console.log("before:"+audioPlayer.currentTime);
        this.audioCurrentTime =  this.audioAllDuration*value/100;
        console.log(parseInt(this.audioAllDuration*value/100));
        audioPlayer.currentTime = parseInt(this.audioAllDuration*value/100);
        console.log("after:"+audioPlayer.currentTime);
      },
      //设置倍速播放
      changeMultiple(op){
        if(op=='add')
        {
          if(this.multipleIndex<5){
            this.multipleIndex++;
          }
        }
        else if(op=='reduce')
        {
          if(this.multipleIndex>0){
            this.multipleIndex--;
          }
        }



        let audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.playbackRate = this.multipleArray[this.multipleIndex]
      }
    },
    created:function () {
      this.setAudioInterval();
    }
  }

  //格式化秒
  function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)
      // var hours = Math.floor(second / 3600)
      // second = second - hours * 3600
      second = second
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60
      return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '00:00'
    }
  }
</script>
<style>
  body {
    background: #fff;
  }

  .audio_cover {
    width: 100%;
  }

  .audio_title {
    font-size: 18px;
    padding: 15px 10px;
    /*margin-bottom: 10px;*/
  }

  .audio_des {
    padding: 0 15px;

  }
  .aplayer-icon-mode{
    display: none!important;
  }
  /*自定义音频器*/
  .audioBox{
    padding: 10px 15px;
  }
  .audioBox_top{
    line-height: 24px;
  }
  .audioBox_left{
    float: left;
    color: #999;
    font-size: 12px;
    width: 14%;
    text-align: left;
  }
  .audioBox_slider{
    float: left;
    width: 72%;
    margin-top: 10px;
  }
  .audioBox_right{
    float: left;
    color: #999;
    font-size: 12px;
    width: 14%;
    text-align: center;
  }
  .van-slider__button{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #18aefc;
    border: 4px solid #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,.5);
  }
  .audioBox_control{
    text-align: center;
    margin-top: 15px;
    position: relative;
  }
  .iconfont_control{
    display: inline-block;
    margin: 0 auto;
    font-size: 54px;
    color: #18aefc;
  }
  .audioBox_multiple{
    position: absolute;
    right: 10px;
    top: 15px;
    color: #b4b4b4;
  }
  .multiple_number{
    margin-bottom: 6px;
    font-size: 14px;
  }
  .multiple_des{
    font-size: 12px;
  }
  /*自定义音频器*/
</style>
