const Dashboard = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">工作台</h1>
                    <p class="page-desc">欢迎回来，这是您的工作概览与快捷入口</p>
                </div>
            </div>

            <!-- Stat Cards -->
            <div class="stat-grid">
                <div class="stat-card" v-for="stat in stats" :key="stat.label">
                    <div :class="['stat-icon', stat.color]" v-html="stat.icon"></div>
                    <div class="stat-info">
                        <div class="stat-value">{{ stat.value }}</div>
                        <div class="stat-label">{{ stat.label }}</div>
                        <div v-if="stat.trend" :class="['stat-trend', stat.trendDir]">
                            <span v-html="stat.trendDir === 'up' ? '&#9650;' : '&#9660;'"></span>
                            {{ stat.trend }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Access Modules -->
            <div style="margin-bottom: 24px;">
                <h2 style="font-size: 17px; font-weight: 600; color: var(--gray-800); margin-bottom: 16px;">快速入口</h2>
                <div class="module-grid">
                    <router-link v-for="mod in modules" :key="mod.title" :to="mod.to" style="text-decoration: none; color: inherit;">
                        <div :class="['module-card', mod.color]">
                            <div :class="['module-icon', mod.color]" v-html="mod.icon"></div>
                            <h3>{{ mod.title }}</h3>
                            <p>{{ mod.desc }}</p>
                            <div class="module-features">
                                <span v-for="tag in mod.tags" :key="tag" :class="['tag', 'tag-' + mod.color]" style="font-size: 11px;">{{ tag }}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Bottom Grid: Recent Activity + Quality Overview -->
            <div class="grid-2">
                <!-- Recent Activity -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">近期动态</span>
                        <button class="btn btn-ghost btn-sm">查看全部</button>
                    </div>
                    <div class="card-body">
                        <div class="timeline">
                            <div class="timeline-item" v-for="(event, index) in recentEvents" :key="index">
                                <div :class="['timeline-dot', index === 0 ? 'active' : '']"></div>
                                <div class="timeline-title">{{ event.title }}</div>
                                <div class="timeline-desc">{{ event.desc }}</div>
                                <div class="timeline-time">{{ event.time }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quality Overview -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">质量概览</span>
                        <button class="btn btn-ghost btn-sm">详细报告</button>
                    </div>
                    <div class="card-body">
                        <div class="chart-placeholder">
                            <div class="chart-bars">
                                <div class="chart-bar" v-for="(bar, index) in chartData" :key="index"
                                     :style="{ height: bar.height + '%', background: bar.color }">
                                </div>
                            </div>
                            <div class="chart-labels">
                                <span class="chart-label" v-for="(bar, index) in chartData" :key="'lbl-' + index">{{ bar.label }}</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-around; margin-top: 16px; text-align: center;">
                            <div v-for="summary in qualitySummary" :key="summary.label" style="flex: 1;">
                                <div style="font-size: 20px; font-weight: 700;" :style="{ color: summary.color }">{{ summary.value }}</div>
                                <div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">{{ summary.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            stats: [
                { label: '规范文档总数', value: '2,156', icon: '&#128218;', color: 'blue', trend: '+32 本月新增', trendDir: 'up' },
                { label: '校审要点', value: '3,280', icon: '&#9989;', color: 'green', trend: '+156 本月新增', trendDir: 'up' },
                { label: '历史项目', value: '586', icon: '&#128193;', color: 'orange', trend: '+12 本月新增', trendDir: 'up' },
                { label: '标书生成', value: '128份', icon: '&#128221;', color: 'red', trend: '', trendDir: 'up' },
                { label: '图审任务', value: '89份', icon: '&#128269;', color: 'purple', trend: '', trendDir: 'up' },
                { label: '文审任务', value: '67份', icon: '&#128203;', color: 'blue', trend: '', trendDir: 'up' }
            ],
            modules: [
                {
                    title: '技术库',
                    desc: '汇集国家标准、行业规范、标准图集及技术资料，支持全文检索与智能推荐',
                    icon: '&#128218;',
                    color: 'blue',
                    to: '/knowledge/tech',
                    tags: ['规范标准', '标准图集']
                },
                {
                    title: '校审库',
                    desc: '整理校审要点、常见错误案例与质量红线，辅助设计自审与互审',
                    icon: '&#9989;',
                    color: 'green',
                    to: '/knowledge/review',
                    tags: ['校审要点', '错误案例', '质量红线']
                },
                {
                    title: '项目库',
                    desc: '沉淀历史项目成果，支持方案复用与造价对标分析',
                    icon: '&#128193;',
                    color: 'orange',
                    to: '/knowledge/project',
                    tags: ['历史项目', '方案复用', '造价对标']
                },
                {
                    title: '智能标书中心',
                    desc: '基于AI技术自动生成投标文件，支持模板管理与质量检查',
                    icon: '&#128221;',
                    color: 'red',
                    to: '/tools/bid',
                    tags: ['标书生成', '模板管理', '质量检查']
                },
                {
                    title: '智能图审工场',
                    desc: '自动识别CAD图纸内容，比对规范要求，生成审查报告',
                    icon: '&#128269;',
                    color: 'purple',
                    to: '/tools/drawing',
                    tags: ['PDF处理', 'OCR识别', '规范比对']
                },
                {
                    title: '智能文审中心',
                    desc: '智能审查合同条款、设计文本一致性，自动标注风险项',
                    icon: '&#128203;',
                    color: 'blue',
                    to: '/tools/text',
                    tags: ['合同审查', '文本校审', '一致性检查']
                },
                {
                    title: 'CAD智能设计助手',
                    desc: '嵌入CAD环境的设计辅助插件，支持自然语言指令与绘图规则校验',
                    icon: '&#9999;&#65039;',
                    color: 'green',
                    to: '/tools/cad',
                    tags: ['插件框架', '绘图规则', '自然语言']
                },
                {
                    title: '智能方案设计引擎',
                    desc: '面向桥梁加固、照明设计、污水工艺等场景的智能方案生成引擎',
                    icon: '&#129504;',
                    color: 'orange',
                    to: '/tools/scheme',
                    tags: ['桥梁加固', '照明设计', '污水工艺']
                }
            ],
            recentEvents: [
                {
                    title: '张工 提交了XX道路项目标书生成任务',
                    desc: '项目编号: PRJ-2026-0415，预计2小时后完成',
                    time: '10分钟前'
                },
                {
                    title: '系统完成 规范CJJ 1-2008 废止标注',
                    desc: '已自动更新规范状态为"已废止"，并推送通知至相关设计人员',
                    time: '1小时前'
                },
                {
                    title: '李工 完成了XX桥梁施工图图审任务',
                    desc: '审查结果：通过，共发现3处标注问题，已自动生成修改建议',
                    time: '2小时前'
                },
                {
                    title: '设计三所 上传了12份新规范文档',
                    desc: '涵盖GB 50014-2021等最新国家标准，已入库并完成索引',
                    time: '3小时前'
                },
                {
                    title: '王工 通过CAD助手完成了道路纵断面绘制',
                    desc: '使用自然语言指令，AI自动生成符合规范的纵断面图',
                    time: '5小时前'
                }
            ],
            chartData: [
                { label: '1月', height: 65, color: '#3b82f6' },
                { label: '2月', height: 45, color: '#6366f1' },
                { label: '3月', height: 78, color: '#10b981' },
                { label: '4月', height: 55, color: '#f59e0b' },
                { label: '5月', height: 90, color: '#10b981' },
                { label: '6月', height: 72, color: '#3b82f6' }
            ],
            qualitySummary: [
                { label: '一次通过率', value: '92.3%', color: '#10b981' },
                { label: '平均审查时长', value: '1.8天', color: '#3b82f6' },
                { label: '问题整改率', value: '98.7%', color: '#f59e0b' }
            ]
        };
    },
    computed: {},
    methods: {}
};

window.Dashboard = Dashboard;
