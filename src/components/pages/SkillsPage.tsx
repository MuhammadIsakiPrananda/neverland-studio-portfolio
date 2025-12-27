import { Code, Database, Layout, Cloud, Shield, Cpu, Globe, Monitor, Smartphone, Server, GitBranch, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SkillsPageProps {
  theme: 'light' | 'dark';
}

export default function SkillsPage({ theme }: SkillsPageProps) {
  const isDark = theme === 'dark';
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t('skills.categories.frontend'),
      icon: <Layout className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-blue-500 to-cyan-500',
      skills: [
        { name: t('skills.skills.react'), level: 95, icon: '⚛️' },
        { name: t('skills.skills.typescript'), level: 90, icon: '📘' },
        { name: t('skills.skills.nextjs'), level: 88, icon: '▲' },
        { name: t('skills.skills.vue'), level: 85, icon: '💚' },
        { name: t('skills.skills.tailwind'), level: 95, icon: '🎨' },
        { name: t('skills.skills.html'), level: 98, icon: '🌐' },
      ]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Server className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-green-500 to-emerald-500',
      skills: [
        { name: t('skills.skills.nodejs'), level: 92, icon: '🟢' },
        { name: t('skills.skills.python'), level: 88, icon: '🐍' },
        { name: t('skills.skills.php'), level: 85, icon: '🐘' },
        { name: t('skills.skills.laravel'), level: 90, icon: '🔴' },
        { name: t('skills.skills.express'), level: 90, icon: '⚡' },
        { name: t('skills.skills.restapi'), level: 93, icon: '🔌' },
      ]
    },
    {
      title: t('skills.categories.database'),
      icon: <Database className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-purple-500 to-pink-500',
      skills: [
        { name: t('skills.skills.mongodb'), level: 90, icon: '🍃' },
        { name: t('skills.skills.postgresql'), level: 88, icon: '🐘' },
        { name: t('skills.skills.mysql'), level: 92, icon: '🐬' },
        { name: t('skills.skills.redis'), level: 85, icon: '🔴' },
        { name: t('skills.skills.firebase'), level: 87, icon: '🔥' },
        { name: t('skills.skills.graphql'), level: 82, icon: '◈' },
      ]
    },
    {
      title: t('skills.categories.cloud'),
      icon: <Cloud className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-orange-500 to-red-500',
      skills: [
        { name: t('skills.skills.aws'), level: 85, icon: '☁️' },
        { name: t('skills.skills.googlecloud'), level: 82, icon: '🌩️' },
        { name: t('skills.skills.docker'), level: 88, icon: '🐳' },
        { name: t('skills.skills.kubernetes'), level: 80, icon: '☸️' },
        { name: t('skills.skills.cicd'), level: 87, icon: '🔄' },
        { name: t('skills.skills.nginx'), level: 85, icon: '🟩' },
      ]
    },
    {
      title: t('skills.categories.mobile'),
      icon: <Smartphone className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-indigo-500 to-purple-500',
      skills: [
        { name: t('skills.skills.reactnative'), level: 88, icon: '📱' },
        { name: t('skills.skills.flutter'), level: 85, icon: '🦋' },
        { name: t('skills.skills.ios'), level: 80, icon: '🍎' },
        { name: t('skills.skills.android'), level: 82, icon: '🤖' },
        { name: t('skills.skills.pwa'), level: 90, icon: '⚡' },
        { name: t('skills.skills.ionic'), level: 78, icon: '💧' },
      ]
    },
    {
      title: t('skills.categories.tools'),
      icon: <Cpu className="w-6 h-6" strokeWidth={1.5} />,
      gradient: 'from-pink-500 to-rose-500',
      skills: [
        { name: t('skills.skills.git'), level: 95, icon: '🐙' },
        { name: t('skills.skills.vscode'), level: 98, icon: '💻' },
        { name: t('skills.skills.figma'), level: 90, icon: '🎨' },
        { name: t('skills.skills.webpack'), level: 85, icon: '📦' },
        { name: t('skills.skills.jest'), level: 88, icon: '🃏' },
        { name: t('skills.skills.postman'), level: 92, icon: '📮' },
      ]
    },
  ];

  const softSkills = [
    { name: t('skills.softSkills.problemSolving'), level: 95, icon: '🧩' },
    { name: t('skills.softSkills.teamCollaboration'), level: 93, icon: '🤝' },
    { name: t('skills.softSkills.communication'), level: 90, icon: '💬' },
    { name: t('skills.softSkills.projectManagement'), level: 88, icon: '📊' },
    { name: t('skills.softSkills.creativeThinking'), level: 92, icon: '💡' },
    { name: t('skills.softSkills.timeManagement'), level: 90, icon: '⏰' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">{t('skills.badge')}</span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t('skills.hero.title')} <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{t('skills.hero.titleHighlight')}</span> {t('skills.hero.titleSuffix')}
            </h1>

            {/* Description */}
            <p className={`text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed animate-fade-in-up delay-200 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {t('skills.hero.subtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto animate-fade-in-up delay-300">
              {[
                { label: t('skills.stats.technologies'), value: '50+', icon: <Code className="w-5 h-5" /> },
                { label: t('skills.stats.frameworks'), value: '30+', icon: <GitBranch className="w-5 h-5" /> },
                { label: t('skills.stats.certifications'), value: '10+', icon: <Shield className="w-5 h-5" /> },
                { label: t('skills.stats.experience'), value: `8+ ${t('skills.stats.years')}`, icon: <TrendingUp className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border backdrop-blur-sm ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50' 
                      : 'bg-white/50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-center mb-2 text-blue-500">
                    {stat.icon}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs sm:text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {t('skills.technicalProficiencies.title')}
              </h2>
              <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('skills.technicalProficiencies.subtitle')}
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {skillCategories.map((category, idx) => (
                <div
                  key={idx}
                  className={`group p-6 sm:p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50' 
                      : 'bg-white/50 border-slate-200 hover:bg-white'
                  }`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white`}>
                      {category.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIdx) => (
                      <div key={skillIdx}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{skill.icon}</span>
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {skill.name}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {skill.level}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className={`h-2 rounded-full overflow-hidden ${
                          isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div
                            className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-1000 ease-out`}
                            style={{ 
                              width: `${skill.level}%`,
                              animation: `slideIn 1s ease-out ${skillIdx * 0.1}s forwards`,
                              transform: 'translateX(-100%)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Soft Skills Section */}
      <section className={`py-16 sm:py-20 md:py-24 ${
        isDark ? 'bg-slate-900/50' : 'bg-slate-100/50'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {t('skills.softSkills.title')}
              </h2>
              <p className={`text-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('skills.softSkills.subtitle')}
              </p>
            </div>

            {/* Soft Skills Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {softSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{skill.icon}</div>
                    <h4 className={`text-lg font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {skill.name}
                    </h4>
                    <div className={`h-2 rounded-full overflow-hidden mb-2 ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {skill.level}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Language Skills Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {t('skills.languages.title')}
              </h2>
              <p className={`text-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('skills.languages.subtitle')}
              </p>
            </div>

            {/* Languages Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Indonesian */}
              <div
                className={`p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50' 
                    : 'bg-white/50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="text-center">
                  {/* Flag Icon */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-4xl shadow-lg">
                    🇮🇩
                  </div>
                  
                  {/* Language Name */}
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t('skills.languages.indonesian.name')}
                  </h3>
                  
                  {/* Proficiency Level */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-400">{t('skills.languages.indonesian.level')}</span>
                  </div>
                  
                  {/* Skills Breakdown */}
                  <div className="space-y-3">
                    {[
                      { skill: t('skills.languages.indonesian.speaking'), level: 100 },
                      { skill: t('skills.languages.indonesian.writing'), level: 100 },
                      { skill: t('skills.languages.indonesian.reading'), level: 100 },
                      { skill: t('skills.languages.indonesian.listening'), level: 100 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {item.skill}
                          </span>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {item.level}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${
                          isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600"
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* English */}
              <div
                className={`p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50' 
                    : 'bg-white/50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="text-center">
                  {/* Flag Icon */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-4xl shadow-lg">
                    🇬🇧
                  </div>
                  
                  {/* Language Name */}
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t('skills.languages.english.name')}
                  </h3>
                  
                  {/* Proficiency Level */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-400">{t('skills.languages.english.level')}</span>
                  </div>
                  
                  {/* Skills Breakdown */}
                  <div className="space-y-3">
                    {[
                      { skill: t('skills.languages.english.speaking'), level: 90 },
                      { skill: t('skills.languages.english.writing'), level: 95 },
                      { skill: t('skills.languages.english.reading'), level: 98 },
                      { skill: t('skills.languages.english.listening'), level: 92 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {item.skill}
                          </span>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {item.level}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${
                          isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`mt-8 p-6 rounded-2xl border text-center ${
              isDark 
                ? 'bg-slate-900/30 border-slate-700/30' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {t('skills.languages.globalCommunication')}
                </span>
              </div>
              <p className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('skills.languages.globalDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
