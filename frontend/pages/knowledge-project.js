const KnowledgeProject = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">项目库</h1>
                    <p class="page-desc">沉淀所有历史项目的完整信息，形成可复用的案例资源池</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div v-for="(tab, index) in tabs" :key="index"
                     :class="['tab-item', { active: activeTab === index }]"
                     @click="activeTab = index">
                    {{ tab }}
                </div>
            </div>

            <!-- Tab 1: 项目列表 -->
            <div v-show="activeTab === 0">
                <!-- Toolbar -->
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAddProject">&#43; 新增项目</button>
                        <button class="btn btn-outline">&#128229; 导出列表</button>
                    </div>
                    <div class="toolbar-right">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ filteredProjects.length }} 个项目</span>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="projectFilter.major" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="projectFilter.level" style="min-width: 140px;">
                        <option value="">全部等级</option>
                        <option value="国家级">国家级</option>
                        <option value="省级">省级</option>
                        <option value="市级">市级</option>
                        <option value="县级">县级</option>
                    </select>
                    <select class="form-select" v-model="projectFilter.status" style="min-width: 140px;">
                        <option value="">全部状态</option>
                        <option value="进行中">进行中</option>
                        <option value="已完成">已完成</option>
                        <option value="归档">归档</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索项目编号或名称..." v-model="projectFilter.search" style="min-width: 220px;">
                </div>

                <!-- Table -->
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>项目编号</th>
                                <th>项目名称</th>
                                <th>专业</th>
                                <th>项目等级</th>
                                <th>开工日期</th>
                                <th>竣工日期</th>
                                <th>总投资(万元)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredProjects" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td><span :class="['tag', getMajorTagClass(item.major)]">{{ item.major }}</span></td>
                                <td><span :class="['tag', getLevelTagClass(item.level)]">{{ item.level }}</span></td>
                                <td>{{ item.startDate }}</td>
                                <td>{{ item.endDate || '-' }}</td>
                                <td style="font-weight: 600;">{{ item.investment.toLocaleString() }}</td>
                                <td><span :class="['tag', getStatusTagClass(item.status)]">{{ item.status }}</span></td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewProject(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleReuse(item)">复用</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button v-for="p in 5" :key="p" :class="['page-btn', { active: p === 1 }]" @click="projectPage = p">{{ p }}</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 2: 项目详情 -->
            <div v-show="activeTab === 1">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <select class="form-select" v-model="detailFilter" style="min-width: 200px;" @change="handleSelectProject">
                            <option value="">请选择项目</option>
                            <option v-for="item in projects" :key="item.id" :value="item.id">{{ item.code }} - {{ item.name }}</option>
                        </select>
                    </div>
                </div>

                <div v-if="selectedProject">
                    <!-- Basic Info Section -->
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <span class="card-title">&#128203; 基本信息</span>
                        </div>
                        <div class="card-body">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">项目名称</div>
                                    <div class="detail-value">{{ selectedProject.name }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">项目编号</div>
                                    <div class="detail-value" style="font-weight: 600;">{{ selectedProject.code }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">专业</div>
                                    <div class="detail-value"><span :class="['tag', getMajorTagClass(selectedProject.major)]">{{ selectedProject.major }}</span></div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">项目等级</div>
                                    <div class="detail-value"><span :class="['tag', getLevelTagClass(selectedProject.level)]">{{ selectedProject.level }}</span></div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">开工日期</div>
                                    <div class="detail-value">{{ selectedProject.startDate }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">竣工日期</div>
                                    <div class="detail-value">{{ selectedProject.endDate || '尚未竣工' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">总投资</div>
                                    <div class="detail-value" style="font-weight: 700; color: var(--primary); font-size: 16px;">{{ selectedProject.investment.toLocaleString() }} 万元</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">建设地点</div>
                                    <div class="detail-value">{{ selectedProject.location }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">项目状态</div>
                                    <div class="detail-value"><span :class="['tag', getStatusTagClass(selectedProject.status)]">{{ selectedProject.status }}</span></div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">设计阶段</div>
                                    <div class="detail-value">{{ selectedProject.stage }}</div>
                                </div>
                            </div>
                            <!-- Project Description -->
                            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100);">
                                <div style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">项目简介</div>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8; background: var(--gray-50); padding: 14px; border-radius: 6px;">{{ selectedProject.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Personnel Section -->
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <span class="card-title">&#128101; 项目人员</span>
                            <button class="btn btn-outline btn-sm">&#43; 添加人员</button>
                        </div>
                        <div class="card-body">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>职务/角色</th>
                                        <th>专业</th>
                                        <th>职称</th>
                                        <th>联系方式</th>
                                        <th>参与阶段</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(person, index) in selectedProject.personnel" :key="index">
                                        <td style="font-weight: 500;">{{ person.name }}</td>
                                        <td><span :class="['tag', person.role === '项目负责人' ? 'tag-red' : person.role === '专业负责人' ? 'tag-orange' : 'tag-blue']">{{ person.role }}</span></td>
                                        <td>{{ person.major }}</td>
                                        <td>{{ person.title }}</td>
                                        <td style="color: var(--gray-500);">{{ person.contact }}</td>
                                        <td>{{ person.stage }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Awards Section -->
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <span class="card-title">&#127942; 项目获奖情况</span>
                            <button class="btn btn-outline btn-sm">&#43; 添加获奖</button>
                        </div>
                        <div class="card-body">
                            <div v-if="selectedProject.awards && selectedProject.awards.length > 0">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>奖项名称</th>
                                            <th>颁奖机构</th>
                                            <th>获奖年份</th>
                                            <th>获奖等级</th>
                                            <th>备注</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(award, index) in selectedProject.awards" :key="index">
                                            <td style="font-weight: 500;">{{ award.name }}</td>
                                            <td>{{ award.organization }}</td>
                                            <td>{{ award.year }}</td>
                                            <td><span :class="['tag', getAwardTagClass(award.level)]">{{ award.level }}</span></td>
                                            <td style="color: var(--gray-500);">{{ award.remark || '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="empty-state" style="padding: 30px;">
                                <div class="empty-icon">&#127942;</div>
                                <div class="empty-text">暂无获奖记录</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <div class="empty-icon">&#128203;</div>
                            <div class="empty-text">请从上方下拉框选择一个项目查看详情</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 单位资质 -->
            <div v-show="activeTab === 2">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAddQualification">&#43; 新增资质</button>
                    </div>
                    <div class="toolbar-right">
                        <select class="form-select" v-model="qualificationFilter.type" style="min-width: 160px;">
                            <option value="">全部类型</option>
                            <option value="设计资质">设计资质</option>
                            <option value="咨询资质">咨询资质</option>
                            <option value="勘察资质">勘察资质</option>
                            <option value="监理资质">监理资质</option>
                            <option value="其他资质">其他资质</option>
                        </select>
                        <select class="form-select" v-model="qualificationFilter.status" style="min-width: 140px;">
                            <option value="">全部状态</option>
                            <option value="有效">有效</option>
                            <option value="即将到期">即将到期</option>
                            <option value="已过期">已过期</option>
                        </select>
                    </div>
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>资质名称</th>
                                <th>资质类型</th>
                                <th>资质等级</th>
                                <th>证书编号</th>
                                <th>发证机关</th>
                                <th>有效期至</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredQualifications" :key="item.id">
                                <td style="font-weight: 500;">{{ item.name }}</td>
                                <td><span :class="['tag', getQualTypeTagClass(item.type)]">{{ item.type }}</span></td>
                                <td><span :class="['tag', getQualLevelTagClass(item.level)]">{{ item.level }}</span></td>
                                <td style="color: var(--gray-500); font-size: 12px;">{{ item.certNo }}</td>
                                <td>{{ item.authority }}</td>
                                <td>{{ item.validDate }}</td>
                                <td><span :class="['tag', getQualStatusTagClass(item.status)]">{{ item.status }}</span></td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewQualification(item)">查看</button>
                                    <button class="btn btn-outline btn-sm">编辑</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 4: 全院获奖 -->
            <div v-show="activeTab === 3">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAddAward">&#43; 新增获奖</button>
                    </div>
                    <div class="toolbar-right">
                        <select class="form-select" v-model="awardFilter.category" style="min-width: 160px;">
                            <option value="">全部类别</option>
                            <option value="咨询">咨询</option>
                            <option value="设计">设计</option>
                            <option value="可研">可研</option>
                            <option value="建造">建造</option>
                            <option value="科研">科研</option>
                            <option value="其他">其他</option>
                        </select>
                        <select class="form-select" v-model="awardFilter.level" style="min-width: 140px;">
                            <option value="">全部等级</option>
                            <option value="国家级">国家级</option>
                            <option value="省级">省级</option>
                            <option value="市级">市级</option>
                            <option value="行业级">行业级</option>
                        </select>
                        <input class="form-input" type="text" placeholder="搜索奖项名称..." v-model="awardFilter.search" style="min-width: 200px;">
                    </div>
                </div>

                <!-- Award Statistics -->
                <div class="stat-grid" style="margin-bottom: 20px;">
                    <div class="stat-card">
                        <div class="stat-icon blue">&#127942;</div>
                        <div class="stat-info">
                            <div class="stat-value">{{ awardStats.total }}</div>
                            <div class="stat-label">获奖总数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon red">&#127941;</div>
                        <div class="stat-info">
                            <div class="stat-value">{{ awardStats.national }}</div>
                            <div class="stat-label">国家级奖项</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon orange">&#127941;</div>
                        <div class="stat-info">
                            <div class="stat-value">{{ awardStats.provincial }}</div>
                            <div class="stat-label">省级奖项</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green">&#127941;</div>
                        <div class="stat-info">
                            <div class="stat-value">{{ awardStats.municipal }}</div>
                            <div class="stat-label">市级奖项</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>奖项名称</th>
                                <th>获奖类别</th>
                                <th>获奖等级</th>
                                <th>关联项目</th>
                                <th>获奖年份</th>
                                <th>颁奖机构</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredAwards" :key="item.id">
                                <td style="font-weight: 500;">{{ item.name }}</td>
                                <td><span :class="['tag', getAwardCategoryTagClass(item.category)]">{{ item.category }}</span></td>
                                <td><span :class="['tag', getAwardTagClass(item.level)]">{{ item.level }}</span></td>
                                <td style="color: var(--gray-500);">{{ item.project || '-' }}</td>
                                <td>{{ item.year }}</td>
                                <td>{{ item.organization }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewAward(item)">查看</button>
                                    <button class="btn btn-outline btn-sm">编辑</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 5: 项目成果 -->
            <div v-show="activeTab === 4">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleUpload">&#43; 上传文件</button>
                        <button class="btn btn-outline">&#128230; 批量下载</button>
                    </div>
                    <div class="toolbar-right">
                        <select class="form-select" v-model="fileTypeFilter" style="min-width: 140px;">
                            <option value="">全部类型</option>
                            <option value="pdf">PDF文档</option>
                            <option value="doc">Word文档</option>
                            <option value="cad">CAD图纸</option>
                        </select>
                    </div>
                </div>

                <!-- File List -->
                <div class="card">
                    <div class="card-body">
                        <div class="file-item" v-for="file in filteredFiles" :key="file.id">
                            <div :class="['file-icon', file.type]">
                                <span v-if="file.type === 'pdf'">&#128196;</span>
                                <span v-else-if="file.type === 'doc'">&#128209;</span>
                                <span v-else-if="file.type === 'cad'">&#9999;&#65039;</span>
                            </div>
                            <div class="file-info">
                                <div class="file-name">{{ file.name }}</div>
                                <div class="file-meta">{{ file.project }} | {{ file.size }} | {{ file.date }}</div>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn btn-ghost btn-sm" @click="handlePreview(file)">预览</button>
                                <button class="btn btn-primary btn-sm" @click="handleDownloadFile(file)">下载</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div class="upload-area" style="margin-top: 16px;" @click="handleUpload">
                    <div class="upload-icon">&#128228;</div>
                    <div class="upload-text">点击或拖拽文件到此区域上传</div>
                    <div class="upload-hint">支持 PDF、Word、CAD、图片等格式，单个文件不超过 100MB</div>
                </div>
            </div>

            <!-- Tab 6: 项目经验 -->
            <div v-show="activeTab === 5">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <select class="form-select" v-model="expFilter" style="min-width: 140px;">
                            <option value="">全部专业</option>
                            <option value="道路">道路</option>
                            <option value="桥梁">桥梁</option>
                            <option value="排水">排水</option>
                            <option value="规划">规划</option>
                            <option value="照明">照明</option>
                        </select>
                        <input class="form-input" type="text" placeholder="搜索经验关键词..." style="min-width: 220px;">
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-primary btn-sm" @click="handleAddExp">&#43; 提交经验</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="timeline">
                            <div class="timeline-item" v-for="(exp, index) in experiences" :key="index">
                                <div :class="['timeline-dot', index === 0 ? 'active' : '']"></div>
                                <div class="timeline-title">{{ exp.title }}</div>
                                <div class="timeline-time">{{ exp.project }} | {{ exp.time }}</div>
                                <div class="timeline-desc">{{ exp.desc }}</div>
                                <div style="margin-top: 8px; display: flex; gap: 6px;">
                                    <span :class="['tag', 'tag-' + exp.color]">{{ exp.major }}</span>
                                    <span class="tag tag-gray">{{ exp.author }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Detail Modal -->
            <div class="modal-overlay" v-if="showProjectModal" @click.self="showProjectModal = false">
                <div class="modal" style="max-width: 700px;">
                    <div class="modal-header">
                        <span class="modal-title">项目详情 - {{ modalProject.name }}</span>
                        <button class="btn btn-ghost btn-sm" @click="showProjectModal = false">&#10005;</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">项目名称</div>
                                <div class="detail-value">{{ modalProject.name }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">项目编号</div>
                                <div class="detail-value" style="font-weight: 600;">{{ modalProject.code }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">专业</div>
                                <div class="detail-value"><span :class="['tag', getMajorTagClass(modalProject.major)]">{{ modalProject.major }}</span></div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">项目等级</div>
                                <div class="detail-value"><span :class="['tag', getLevelTagClass(modalProject.level)]">{{ modalProject.level }}</span></div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">开工日期</div>
                                <div class="detail-value">{{ modalProject.startDate }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">竣工日期</div>
                                <div class="detail-value">{{ modalProject.endDate || '尚未竣工' }}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">总投资</div>
                                <div class="detail-value" style="font-weight: 700; color: var(--primary); font-size: 16px;">{{ modalProject.investment.toLocaleString() }} 万元</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">建设地点</div>
                                <div class="detail-value">{{ modalProject.location }}</div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100);">
                            <div style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">项目简介</div>
                            <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8; background: var(--gray-50); padding: 14px; border-radius: 6px;">{{ modalProject.description }}</p>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100);">
                            <div style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">&#128101; 项目人员</div>
                            <table class="data-table" style="margin-top: 8px;">
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>职务/角色</th>
                                        <th>专业</th>
                                        <th>职称</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(person, index) in modalProject.personnel" :key="index">
                                        <td style="font-weight: 500;">{{ person.name }}</td>
                                        <td><span :class="['tag', person.role === '项目负责人' ? 'tag-red' : person.role === '专业负责人' ? 'tag-orange' : 'tag-blue']">{{ person.role }}</span></td>
                                        <td>{{ person.major }}</td>
                                        <td>{{ person.title }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100);" v-if="modalProject.awards && modalProject.awards.length > 0">
                            <div style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">&#127942; 获奖情况</div>
                            <div v-for="(award, index) in modalProject.awards" :key="index" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--gray-50); border-radius: 6px; margin-bottom: 6px;">
                                <span style="font-size: 13px; color: var(--gray-700);">{{ award.year }} - {{ award.name }}</span>
                                <span :class="['tag', getAwardTagClass(award.level)]">{{ award.level }}</span>
                                <span style="font-size: 12px; color: var(--gray-400); margin-left: auto;">{{ award.organization }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" @click="showProjectModal = false">关闭</button>
                        <button class="btn btn-primary" @click="handleReuse(modalProject)">复用项目</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['项目列表', '项目详情', '单位资质', '全院获奖', '项目成果', '项目经验'],
            projectPage: 1,
            projectFilter: {
                major: '',
                level: '',
                status: '',
                search: ''
            },
            detailFilter: '',
            selectedProject: null,
            fileTypeFilter: '',
            expFilter: '',
            qualificationFilter: {
                type: '',
                status: ''
            },
            awardFilter: {
                category: '',
                level: '',
                search: ''
            },
            showProjectModal: false,
            modalProject: {},
            projects: [
                {
                    id: 1, code: 'PRJ-2026-001', name: 'XX市滨河路道路改造工程', major: '道路', level: '市级', location: 'XX省XX市',
                    investment: 28600, status: '进行中', stage: '施工图', startDate: '2026-01-10', endDate: '',
                    description: '本项目为XX市滨河路全线道路改造工程，路线全长约5.6公里。主要建设内容包括道路路基路面改造、排水管网改造、照明工程、交通工程及绿化景观工程等。项目采用城市主干路标准设计，设计速度50km/h，红线宽度40米，双向六车道。',
                    personnel: [
                        { name: '张建国', role: '项目负责人', major: '道路', title: '高级工程师', contact: '138****1234', stage: '全阶段' },
                        { name: '李明辉', role: '专业负责人', major: '道路', title: '高级工程师', contact: '139****5678', stage: '全阶段' },
                        { name: '王秀英', role: '设计人员', major: '排水', title: '工程师', contact: '137****9012', stage: '初步设计、施工图' },
                        { name: '陈志强', role: '设计人员', major: '照明', title: '工程师', contact: '136****3456', stage: '施工图' }
                    ],
                    awards: []
                },
                {
                    id: 2, code: 'PRJ-2026-002', name: 'XX大桥维修加固工程', major: '桥梁', level: '省级', location: 'XX省XX市',
                    investment: 15300, status: '已完成', stage: '竣工验收', startDate: '2025-06-15', endDate: '2026-02-28',
                    description: 'XX大桥建于1995年，主桥跨径为（40+60+40）m预应力混凝土连续梁桥。经检测发现主梁存在裂缝、渗水等病害，需要进行维修加固。主要加固方案包括体外预应力加固、裂缝灌浆封闭、桥面系改造等。',
                    personnel: [
                        { name: '赵志远', role: '项目负责人', major: '桥梁', title: '教授级高工', contact: '135****7890', stage: '全阶段' },
                        { name: '孙丽华', role: '专业负责人', major: '桥梁', title: '高级工程师', contact: '134****2345', stage: '全阶段' },
                        { name: '周伟', role: '设计人员', major: '桥梁', title: '工程师', contact: '133****6789', stage: '初步设计、施工图' }
                    ],
                    awards: [
                        { name: 'XX省优秀工程勘察设计奖', organization: 'XX省住房和城乡建设厅', year: '2026', level: '二等奖', remark: '维修加固类' }
                    ]
                },
                {
                    id: 3, code: 'PRJ-2026-003', name: 'XX新区污水管网建设工程', major: '排水', level: '市级', location: 'XX省XX市',
                    investment: 42100, status: '进行中', stage: '初步设计', startDate: '2026-02-01', endDate: '',
                    description: '本项目为XX新区配套污水管网建设工程，服务面积约12平方公里，服务人口约15万人。新建污水主干管约28公里，污水泵站3座。设计采用重力流与压力流相结合的管网布局方案，出水水质执行GB 18918-2002一级A标准。',
                    personnel: [
                        { name: '刘大海', role: '项目负责人', major: '排水', title: '高级工程师', contact: '132****0123', stage: '全阶段' },
                        { name: '黄丽', role: '专业负责人', major: '排水', title: '工程师', contact: '131****4567', stage: '全阶段' }
                    ],
                    awards: []
                },
                {
                    id: 4, code: 'PRJ-2025-045', name: 'XX市城市照明节能改造项目', major: '照明', level: '市级', location: 'XX省XX市',
                    investment: 8600, status: '已完成', stage: '竣工验收', startDate: '2025-03-01', endDate: '2025-11-30',
                    description: '本项目对XX市主城区范围内约12000盏路灯进行LED节能改造，同步建设智慧照明控制系统。改造范围覆盖主城区38条主次干道，改造后照明效果达到CJJ 45-2015标准要求，节能率达到58%。',
                    personnel: [
                        { name: '赵阳', role: '项目负责人', major: '照明', title: '高级工程师', contact: '130****8901', stage: '全阶段' },
                        { name: '钱进', role: '设计人员', major: '照明', title: '工程师', contact: '158****2345', stage: '施工图' }
                    ],
                    awards: [
                        { name: 'XX市绿色照明示范工程奖', organization: 'XX市城市管理综合执法局', year: '2025', level: '一等奖', remark: '节能改造类' }
                    ]
                },
                {
                    id: 5, code: 'PRJ-2025-038', name: 'XX开发区道路网规划', major: '规划', level: '省级', location: 'XX省XX市',
                    investment: 0, status: '已完成', stage: '规划批复', startDate: '2025-01-15', endDate: '2025-08-20',
                    description: '本项目为XX开发区30平方公里范围内的道路网专项规划，规划年限为2025-2035年。规划内容包括道路等级体系规划、交叉口规划、公共交通规划、慢行系统规划及近期建设计划等。',
                    personnel: [
                        { name: '吴晓峰', role: '项目负责人', major: '规划', title: '教授级高工', contact: '159****6789', stage: '全阶段' },
                        { name: '郑慧', role: '设计人员', major: '规划', title: '工程师', contact: '157****0123', stage: '方案、成果' }
                    ],
                    awards: [
                        { name: 'XX省优秀城乡规划设计奖', organization: 'XX省城市规划协会', year: '2025', level: '三等奖', remark: '专项规划类' }
                    ]
                },
                {
                    id: 6, code: 'PRJ-2025-022', name: 'XX市快速路（东段）新建工程', major: '道路', level: '国家级', location: 'XX省XX市',
                    investment: 86700, status: '进行中', stage: '施工图', startDate: '2025-08-01', endDate: '',
                    description: '本项目为XX市快速路系统东段新建工程，路线全长约12.8公里，设计速度80km/h。主要建设内容包括高架桥梁约8.5公里、互通式立交4座、上下匝道8对、地面辅道及附属工程。项目采用PPP模式建设。',
                    personnel: [
                        { name: '张建国', role: '项目负责人', major: '道路', title: '教授级高工', contact: '138****1234', stage: '全阶段' },
                        { name: '李明辉', role: '专业负责人', major: '道路', title: '高级工程师', contact: '139****5678', stage: '全阶段' },
                        { name: '陈志强', role: '设计人员', major: '桥梁', title: '高级工程师', contact: '136****3456', stage: '初步设计、施工图' },
                        { name: '林小红', role: '设计人员', major: '排水', title: '工程师', contact: '155****7890', stage: '施工图' }
                    ],
                    awards: []
                },
                {
                    id: 7, code: 'PRJ-2024-118', name: 'XX立交桥改造工程', major: '桥梁', level: '省级', location: 'XX省XX市',
                    investment: 52400, status: '归档', stage: '竣工验收', startDate: '2023-03-01', endDate: '2024-12-15',
                    description: '本项目为XX市主要交通节点立交桥的改造工程，原立交建于1990年，已不能满足日益增长的交通需求。改造方案将原部分苜蓿叶立交改造为涡轮形立交，新增定向匝道，设计速度主线60km/h，匝道30-40km/h。',
                    personnel: [
                        { name: '赵志远', role: '项目负责人', major: '桥梁', title: '教授级高工', contact: '135****7890', stage: '全阶段' },
                        { name: '孙丽华', role: '专业负责人', major: '桥梁', title: '高级工程师', contact: '134****2345', stage: '全阶段' }
                    ],
                    awards: [
                        { name: 'XX省优秀工程勘察设计奖', organization: 'XX省住房和城乡建设厅', year: '2025', level: '一等奖', remark: '桥梁工程类' },
                        { name: '全国优秀工程勘察设计行业奖', organization: '中国勘察设计协会', year: '2025', level: '二等奖', remark: '市政公用工程' }
                    ]
                },
                {
                    id: 8, code: 'PRJ-2024-095', name: 'XX市雨水泵站及配套管网工程', major: '排水', level: '市级', location: 'XX省XX市',
                    investment: 31200, status: '归档', stage: '竣工验收', startDate: '2023-06-01', endDate: '2024-09-30',
                    description: '本项目新建雨水泵站1座（设计规模15m\u00B3/s），配套雨水管网约18公里。服务面积约为6.5平方公里，有效解决该区域逢暴雨即涝的问题。泵站采用智能化远程控制系统，实现无人值守运行。',
                    personnel: [
                        { name: '刘大海', role: '项目负责人', major: '排水', title: '高级工程师', contact: '132****0123', stage: '全阶段' },
                        { name: '黄丽', role: '专业负责人', major: '排水', title: '工程师', contact: '131****4567', stage: '全阶段' }
                    ],
                    awards: [
                        { name: 'XX市优秀市政工程设计奖', organization: 'XX市勘察设计协会', year: '2024', level: '一等奖', remark: '排水工程类' }
                    ]
                }
            ],
            qualifications: [
                { id: 1, name: '市政行业（燃气工程、道路工程、桥梁工程、给水工程、排水工程）设计', type: '设计资质', level: '甲级', certNo: 'A137XXXXXX-1/1', authority: '住房和城乡建设部', validDate: '2028-12-31', status: '有效' },
                { id: 2, name: '市政公用工程监理', type: '监理资质', level: '甲级', certNo: 'E137XXXXXX-1/1', authority: '住房和城乡建设部', validDate: '2027-06-30', status: '有效' },
                { id: 3, name: '工程咨询（市政公用工程）', type: '咨询资质', level: '甲级', certNo: '咨137XXXXXX', authority: '中国工程咨询协会', validDate: '2027-09-15', status: '有效' },
                { id: 4, name: '岩土工程勘察', type: '勘察资质', level: '乙级', certNo: 'B137XXXXXX-1/1', authority: '住房和城乡建设部', validDate: '2026-03-31', status: '即将到期' },
                { id: 5, name: '城乡规划编制', type: '其他资质', level: '乙级', certNo: '城规137XXXXXX', authority: '住房和城乡建设部', validDate: '2027-12-31', status: '有效' },
                { id: 6, name: '工程测量', type: '勘察资质', level: '乙级', certNo: 'B137XXXXXX-2/1', authority: '住房和城乡建设部', validDate: '2028-08-15', status: '有效' },
                { id: 7, name: '建筑行业（建筑工程）设计', type: '设计资质', level: '乙级', certNo: 'A137XXXXXX-2/1', authority: '住房和城乡建设部', validDate: '2029-05-20', status: '有效' },
                { id: 8, name: '市政行业（环境卫生工程）设计', type: '设计资质', level: '乙级', certNo: 'A137XXXXXX-3/1', authority: '住房和城乡建设部', validDate: '2025-11-30', status: '已过期' }
            ],
            awards: [
                { id: 1, name: '全国优秀工程勘察设计行业奖', category: '设计', level: '国家级', project: 'XX立交桥改造工程', year: '2025', organization: '中国勘察设计协会' },
                { id: 2, name: '中国工程咨询协会优秀咨询成果奖', category: '咨询', level: '国家级', project: 'XX市快速路（东段）新建工程', year: '2025', organization: '中国工程咨询协会' },
                { id: 3, name: 'XX省优秀工程勘察设计奖', category: '设计', level: '省级', project: 'XX立交桥改造工程', year: '2025', organization: 'XX省住房和城乡建设厅' },
                { id: 4, name: 'XX省优秀工程勘察设计奖', category: '设计', level: '省级', project: 'XX大桥维修加固工程', year: '2026', organization: 'XX省住房和城乡建设厅' },
                { id: 5, name: 'XX省优秀城乡规划设计奖', category: '咨询', level: '省级', project: 'XX开发区道路网规划', year: '2025', organization: 'XX省城市规划协会' },
                { id: 6, name: 'XX省工程建设优秀QC成果奖', category: '科研', level: '省级', project: '', year: '2024', organization: 'XX省建筑业协会' },
                { id: 7, name: 'XX市优秀市政工程设计奖', category: '设计', level: '市级', project: 'XX市雨水泵站及配套管网工程', year: '2024', organization: 'XX市勘察设计协会' },
                { id: 8, name: 'XX市绿色照明示范工程奖', category: '设计', level: '市级', project: 'XX市城市照明节能改造项目', year: '2025', organization: 'XX市城市管理综合执法局' },
                { id: 9, name: '全国市政公用工程设计二等奖', category: '设计', level: '国家级', project: 'XX快速路综合改造工程', year: '2023', organization: '中国勘察设计协会' },
                { id: 10, name: 'XX省可行性研究报告优秀成果奖', category: '可研', level: '省级', project: 'XX市轨道交通1号线工程', year: '2024', organization: 'XX省工程咨询协会' },
                { id: 11, name: '中国建设工程鲁班奖（参建）', category: '建造', level: '国家级', project: 'XX市民中心工程', year: '2023', organization: '中国建筑业协会' },
                { id: 12, name: 'XX省优质工程奖（参建）', category: '建造', level: '省级', project: 'XX市体育中心工程', year: '2024', organization: 'XX省建筑业协会' }
            ],
            projectFiles: [
                { id: 1, name: '滨河路道路改造工程施工图设计总说明.pdf', type: 'pdf', project: 'PRJ-2026-001', size: '12.3 MB', date: '2026-03-20' },
                { id: 2, name: 'XX大桥维修加固方案设计报告.doc', type: 'doc', project: 'PRJ-2026-002', size: '8.7 MB', date: '2026-02-15' },
                { id: 3, name: '滨河路道路平面图.dwg', type: 'cad', project: 'PRJ-2026-001', size: '24.6 MB', date: '2026-03-18' },
                { id: 4, name: '新区污水管网初步设计文件.pdf', type: 'pdf', project: 'PRJ-2026-003', size: '18.9 MB', date: '2026-03-10' },
                { id: 5, name: 'XX立交桥改造工程竣工验收报告.doc', type: 'doc', project: 'PRJ-2024-118', size: '6.2 MB', date: '2025-12-05' },
                { id: 6, name: '雨水泵站工艺流程图.dwg', type: 'cad', project: 'PRJ-2024-095', size: '15.8 MB', date: '2025-10-20' }
            ],
            experiences: [
                {
                    title: '旧路改造项目中地下管线冲突的处理经验',
                    project: 'XX市滨河路道路改造工程',
                    time: '2026-03-15',
                    desc: '在旧路改造过程中，发现地下管线密集且资料缺失，通过与管线单位协调，采用探地雷达先行探测、局部开挖确认的方案，有效避免了施工中管线损坏事故。建议今后旧路改造项目前期必须安排地下管线专项调查。',
                    major: '道路',
                    author: '张工',
                    color: 'blue'
                },
                {
                    title: '大跨径桥梁加固方案比选经验总结',
                    project: 'XX大桥维修加固工程',
                    time: '2026-02-20',
                    desc: '针对大跨径预应力混凝土连续梁桥的加固方案，通过碳纤维布粘贴、体外预应力加固、增大截面法三种方案的比选分析，最终采用体外预应力加固方案。该方案在保证结构安全的同时，最大限度减少了对交通的影响。',
                    major: '桥梁',
                    author: '李工',
                    color: 'green'
                },
                {
                    title: '污水管网水力计算模型优化经验',
                    project: 'XX新区污水管网建设工程',
                    time: '2026-01-28',
                    desc: '在大型污水管网设计中，通过采用EPANET水力模型进行模拟分析，优化了管网布局和管径选择，使管网总造价降低约12%。建议在同类项目中推广水力模型辅助设计的做法。',
                    major: '排水',
                    author: '王工',
                    color: 'blue'
                },
                {
                    title: 'LED路灯改造项目节能效果评估',
                    project: 'XX市城市照明节能改造项目',
                    time: '2025-11-10',
                    desc: '通过对城区12000盏路灯的LED改造，实测节能率达到58%。关键经验：在灯具选型时不仅要考虑光效，还要关注色温、显色指数和配光曲线，确保改造后照明质量不降低。',
                    major: '照明',
                    author: '赵工',
                    color: 'orange'
                },
                {
                    title: '快速路设计中互通式立交选型经验',
                    project: 'XX市快速路（东段）新建工程',
                    time: '2025-09-25',
                    desc: '在快速路互通式立交选型中，综合考虑交通量预测、地形地貌、征地拆迁等因素，最终选择部分苜蓿叶+定向匝道的组合形式。设计经验：立交形式应结合远期交通需求预留改造条件，避免二次改造。',
                    major: '道路',
                    author: '陈工',
                    color: 'blue'
                }
            ]
        };
    },
    computed: {
        filteredProjects() {
            return this.projects.filter(item => {
                if (this.projectFilter.major && item.major !== this.projectFilter.major) return false;
                if (this.projectFilter.level && item.level !== this.projectFilter.level) return false;
                if (this.projectFilter.status && item.status !== this.projectFilter.status) return false;
                if (this.projectFilter.search) {
                    const keyword = this.projectFilter.search.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.name.includes(this.projectFilter.search);
                }
                return true;
            });
        },
        filteredFiles() {
            if (!this.fileTypeFilter) return this.projectFiles;
            return this.projectFiles.filter(f => f.type === this.fileTypeFilter);
        },
        filteredQualifications() {
            return this.qualifications.filter(item => {
                if (this.qualificationFilter.type && item.type !== this.qualificationFilter.type) return false;
                if (this.qualificationFilter.status && item.status !== this.qualificationFilter.status) return false;
                return true;
            });
        },
        filteredAwards() {
            return this.awards.filter(item => {
                if (this.awardFilter.category && item.category !== this.awardFilter.category) return false;
                if (this.awardFilter.level && item.level !== this.awardFilter.level) return false;
                if (this.awardFilter.search) {
                    const keyword = this.awardFilter.search.toLowerCase();
                    return item.name.toLowerCase().includes(keyword) || (item.project && item.project.includes(this.awardFilter.search));
                }
                return true;
            });
        },
        awardStats() {
            return {
                total: this.awards.length,
                national: this.awards.filter(a => a.level === '国家级').length,
                provincial: this.awards.filter(a => a.level === '省级').length,
                municipal: this.awards.filter(a => a.level === '市级').length
            };
        }
    },
    methods: {
        getMajorTagClass(major) {
            const map = { '道路': 'tag-blue', '桥梁': 'tag-green', '排水': 'tag-purple', '规划': 'tag-orange', '照明': 'tag-gray' };
            return map[major] || 'tag-gray';
        },
        getLevelTagClass(level) {
            const map = { '国家级': 'tag-red', '省级': 'tag-orange', '市级': 'tag-blue', '县级': 'tag-gray' };
            return map[level] || 'tag-gray';
        },
        getStatusTagClass(status) {
            const map = { '进行中': 'tag-blue', '已完成': 'tag-green', '归档': 'tag-gray' };
            return map[status] || 'tag-gray';
        },
        getAwardTagClass(level) {
            const map = { '一等奖': 'tag-red', '二等奖': 'tag-orange', '三等奖': 'tag-blue', '国家级': 'tag-red', '省级': 'tag-orange', '市级': 'tag-blue', '行业级': 'tag-purple' };
            return map[level] || 'tag-gray';
        },
        getAwardCategoryTagClass(category) {
            const map = { '咨询': 'tag-purple', '设计': 'tag-blue', '可研': 'tag-orange', '建造': 'tag-green', '科研': 'tag-red', '其他': 'tag-gray' };
            return map[category] || 'tag-gray';
        },
        getQualTypeTagClass(type) {
            const map = { '设计资质': 'tag-blue', '咨询资质': 'tag-purple', '勘察资质': 'tag-orange', '监理资质': 'tag-green', '其他资质': 'tag-gray' };
            return map[type] || 'tag-gray';
        },
        getQualLevelTagClass(level) {
            const map = { '甲级': 'tag-red', '乙级': 'tag-orange', '丙级': 'tag-blue' };
            return map[level] || 'tag-gray';
        },
        getQualStatusTagClass(status) {
            const map = { '有效': 'tag-green', '即将到期': 'tag-orange', '已过期': 'tag-red' };
            return map[status] || 'tag-gray';
        },
        handleSelectProject() {
            if (this.detailFilter) {
                this.selectedProject = this.projects.find(p => p.id === this.detailFilter) || null;
            } else {
                this.selectedProject = null;
            }
        },
        handleAddProject() {
            alert('打开新增项目对话框');
        },
        handleViewProject(item) {
            this.modalProject = item;
            this.showProjectModal = true;
        },
        handleReuse(item) {
            alert('复用项目方案：' + item.code + ' ' + item.name);
        },
        handleUpload() {
            alert('打开文件上传对话框');
        },
        handlePreview(file) {
            alert('预览文件：' + file.name);
        },
        handleDownloadFile(file) {
            alert('下载文件：' + file.name);
        },
        handleAddExp() {
            alert('打开提交经验对话框');
        },
        handleAddQualification() {
            alert('打开新增资质对话框');
        },
        handleViewQualification(item) {
            alert('查看资质详情：' + item.name);
        },
        handleAddAward() {
            alert('打开新增获奖对话框');
        },
        handleViewAward(item) {
            alert('查看获奖详情：' + item.name);
        }
    }
};

window.KnowledgeProject = KnowledgeProject;
