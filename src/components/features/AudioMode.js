import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  RotateCcw,
  Settings,
  Headphones,
  Gauge,
  Timer,
  FileText,
  BarChart3
} from 'lucide-react';
import SidebarHeader from '../common/layout/SidebarHeader';
import SidebarButton from '../common/buttons/SidebarButton';

const AudioMode = ({ document }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [settings, setSettings] = useState({
    speed: 1.0,
    voice: 'default',
    pitch: 1.0,
    volume: 0.8,
    pauseBetweenSentences: 1000,
    highlightText: true,
    autoRepeat: false
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const speechSynthesis = useRef(window.speechSynthesis);
  const currentUtterance = useRef(null);
  const pauseTimeout = useRef(null);

  useEffect(() => {
    if (document?.content) {
      processSentences();
    }
    return () => {
      stopSpeech();
    };
  }, [document]);

  useEffect(() => {
    if (sentences.length > 0) {
      calculateDuration();
    }
  }, [sentences, settings.speed, settings.pauseBetweenSentences]);

  const processSentences = () => {
    if (!document?.content) return;

    // 将文档内容分割成句子
    const content = document.content
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const sentenceArray = content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');

    setSentences(sentenceArray);
    setCurrentSentence(0);
    setProgress(0);
  };

  const calculateDuration = () => {
    if (sentences.length === 0) return;

    // 估算总时长 (平均每分钟150词 + 句子间停顿)
    const totalWords = sentences.reduce((acc, sentence) => {
      return acc + sentence.split(' ').length;
    }, 0);

    const speakingTime = (totalWords / 150) * 60 * 1000 / settings.speed; // 毫秒
    const pauseTime = sentences.length * settings.pauseBetweenSentences;
    const total = speakingTime + pauseTime;

    setDuration(total);
    setRemainingTime(total);
  };

  const speakSentence = (index) => {
    if (index >= sentences.length) {
      if (settings.autoRepeat) {
        setCurrentSentence(0);
        speakSentence(0);
      } else {
        setIsPlaying(false);
        setCurrentSentence(0);
        setProgress(0);
        setRemainingTime(duration);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // 尝试设置语音
    const voices = speechSynthesis.current.getVoices();
    if (settings.voice !== 'default' && voices.length > 0) {
      const selectedVoice = voices.find(voice => voice.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      if (isPlaying) {
        pauseTimeout.current = setTimeout(() => {
          setCurrentSentence(index + 1);
          updateProgress(index + 1);
          speakSentence(index + 1);
        }, settings.pauseBetweenSentences);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    currentUtterance.current = utterance;
    speechSynthesis.current.speak(utterance);
  };

  const updateProgress = (sentenceIndex) => {
    const progressPercent = (sentenceIndex / sentences.length) * 100;
    setProgress(progressPercent);
    
    const remaining = duration * (1 - sentenceIndex / sentences.length);
    setRemainingTime(Math.max(0, remaining));
  };

  const startSpeech = () => {
    setIsPlaying(true);
    speakSentence(currentSentence);
  };

  const pauseSpeech = () => {
    setIsPlaying(false);
    speechSynthesis.current.cancel();
    if (pauseTimeout.current) {
      clearTimeout(pauseTimeout.current);
    }
  };

  const stopSpeech = () => {
    setIsPlaying(false);
    speechSynthesis.current.cancel();
    if (pauseTimeout.current) {
      clearTimeout(pauseTimeout.current);
    }
    setCurrentSentence(0);
    setProgress(0);
    setRemainingTime(duration);
  };

  const nextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      const newIndex = currentSentence + 1;
      setCurrentSentence(newIndex);
      updateProgress(newIndex);
      if (isPlaying) {
        pauseSpeech();
        setTimeout(() => {
          setIsPlaying(true);
          speakSentence(newIndex);
        }, 100);
      }
    }
  };

  const previousSentence = () => {
    if (currentSentence > 0) {
      const newIndex = currentSentence - 1;
      setCurrentSentence(newIndex);
      updateProgress(newIndex);
      if (isPlaying) {
        pauseSpeech();
        setTimeout(() => {
          setIsPlaying(true);
          speakSentence(newIndex);
        }, 100);
      }
    }
  };

  const getAvailableVoices = () => {
    return speechSynthesis.current.getVoices().filter(voice => 
      voice.lang.startsWith('en')
    );
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!document) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={Volume2} title="语音模式" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Headphones className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              未选择文档
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              请选择一个文档来开始语音朗读
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (sentences.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={Volume2} title="语音模式" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              没有可朗读的内容
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              当前文档没有文本内容
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <SidebarHeader icon={Volume2} title="语音模式">
        <SidebarButton
          onClick={() => window.location.hash = '#settings/pronunciation'}
          icon={Settings}
          variant="ghost"
          title="发音设置"
        />
      </SidebarHeader>
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 sidebar-scroll">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-indigo-500" />
            {sentences.length} 个句子
          </p>
        </div>

        {/* 设置面板 */}
        {isSettingsOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Settings className="w-4 h-4 mr-2 text-indigo-500" />
              音频设置
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  语速
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.speed}
                  onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-xs text-gray-500 font-medium">{settings.speed}x</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  音量
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-xs text-gray-500 font-medium">{Math.round(settings.volume * 100)}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                语音
              </label>
              <select
                value={settings.voice}
                onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
              >
                <option value="default">默认语音</option>
                {getAvailableVoices().map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                句子间停顿 (毫秒)
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={settings.pauseBetweenSentences}
                onChange={(e) => setSettings(prev => ({ ...prev, pauseBetweenSentences: parseInt(e.target.value) }))}
                className="w-full accent-indigo-500"
              />
              <span className="text-xs text-gray-500 font-medium">{settings.pauseBetweenSentences}ms</span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRepeat"
                checked={settings.autoRepeat}
                onChange={(e) => setSettings(prev => ({ ...prev, autoRepeat: e.target.checked }))}
                className="mr-3 accent-indigo-500"
              />
              <label htmlFor="autoRepeat" className="text-sm text-gray-700 dark:text-gray-300">
                自动重复
              </label>
            </div>
          </div>
        )}

        {/* 进度显示 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">第 {currentSentence + 1} / {sentences.length} 句</span>
            <span className="font-medium">{formatTime(remainingTime)} 剩余</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={previousSentence}
              disabled={currentSentence === 0}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              title="上一句"
            >
              <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={isPlaying ? pauseSpeech : startSpeech}
              className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={nextSentence}
              disabled={currentSentence === sentences.length - 1}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              title="下一句"
            >
              <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={stopSpeech}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
              title="停止"
            >
              <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* 当前句子显示 */}
        {settings.highlightText && sentences[currentSentence] && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800/50">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Volume2 className="w-4 h-4 mr-2 text-indigo-500" />
              当前句子
            </h4>
            <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              {sentences[currentSentence]}
            </p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
            播放统计
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatTime(duration)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">总时长</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {settings.speed}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">播放速度</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">完成进度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioMode;
