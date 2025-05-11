import { TravelDiary, DiaryStatus } from '../types';

// 模拟游记数据
export const mockDiaries: TravelDiary[] = [
  {
    id: '1',
    title: '北京故宫之旅',
    content: '故宫，又名紫禁城，是中国明清两代的皇家宫殿，位于北京中轴线的中心，是中国古代宫廷建筑之精华。故宫是世界上现存规模最大、保存最为完整的木质结构古建筑之一，也是世界上最大的宫殿建筑群。它是第一批全国重点文物保护单位、第一批国家5A级旅游景区，1987年被列为世界文化遗产。',
    images: [
      'https://picsum.photos/id/1018/800/600',
      'https://picsum.photos/id/1015/800/600',
      'https://picsum.photos/id/1019/800/600'
    ],
    author: {
      id: '101',
      username: 'traveler1',
      nickname: '北方旅行者',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-05-20T08:30:00.000Z',
    updatedAt: '2023-05-20T08:30:00.000Z'
  },
  {
    id: '2',
    title: '上海外滩一日游',
    content: '上海外滩位于上海市黄浦区的黄浦江畔，是上海最具特色的旅游景点之一。外滩全长约1.5公里，沿江一侧是中国近代外廊式建筑博览群，也被称为"万国建筑博览群"；隔江东望，是陆家嘴金融贸易区，上海标志性建筑东方明珠电视塔、金茂大厦、上海中心、上海环球金融中心等高楼大厦鳞次栉比、气势恢宏。',
    images: [
      'https://picsum.photos/id/1011/800/600',
      'https://picsum.photos/id/1012/800/600'
    ],
    video: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    author: {
      id: '102',
      username: 'citytraveler',
      nickname: '城市漫步者',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-05-22T10:15:00.000Z',
    updatedAt: '2023-05-22T10:15:00.000Z'
  },
  {
    id: '3',
    title: '杭州西湖美景',
    content: '西湖，位于浙江省杭州市西湖区龙井路1号，杭州市区西部，景区总面积49平方公里，汇水面积为21.22平方公里，湖面面积为6.38平方公里。西湖南、西、北三面环山，东邻城区，南部和钱塘江隔山相望，湖中有苏堤、白堤、杨公堤、跨湖桥等堤桥将湖面分隔，湖中有三岛（小瀛洲、湖心亭、阮公墩）。',
    images: [
      'https://picsum.photos/id/1039/800/600',
      'https://picsum.photos/id/1038/800/600',
      'https://picsum.photos/id/1037/800/600',
      'https://picsum.photos/id/1036/800/600'
    ],
    author: {
      id: '103',
      username: 'naturetrip',
      nickname: '自然探索者',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-05-24T09:45:00.000Z',
    updatedAt: '2023-05-24T09:45:00.000Z'
  },
  {
    id: '4',
    title: '成都熊猫基地之行',
    content: '成都大熊猫繁育研究基地是中国保护大熊猫的科研机构，位于中国四川省成都市成华区熊猫大道1375号，距离成都市中心约10公里。基地占地面积约600亩，生活着100多只大熊猫。在这里，游客可以观赏到大熊猫的各种生活状态，包括进食、活动、休息等。',
    images: [
      'https://picsum.photos/id/1074/800/600',
      'https://picsum.photos/id/1084/800/600'
    ],
    author: {
      id: '104',
      username: 'pandafan',
      nickname: '熊猫爱好者',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    status: DiaryStatus.APPROVED,
    createdAt: '2023-05-15T14:20:00.000Z',
    updatedAt: '2023-05-16T11:30:00.000Z'
  },
  {
    id: '5',
    title: '厦门鼓浪屿旅行记',
    content: '鼓浪屿，一个美丽的小岛，位于福建省厦门市思明区，面积约1.87平方公里。这里有着独特的历史风貌和文化特色，是闽南文化的重要组成部分。岛上汇集了各种风格的建筑，有中国传统的、闽南的、东南亚的，也有欧洲的，被誉为"万国建筑博览会"。',
    images: [
      'https://picsum.photos/id/1044/800/600',
      'https://picsum.photos/id/1043/800/600',
      'https://picsum.photos/id/1042/800/600'
    ],
    author: {
      id: '105',
      username: 'islandlover',
      nickname: '岛屿漫游者',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    status: DiaryStatus.REJECTED,
    rejectReason: '内容不完整，请添加更多详细信息。',
    createdAt: '2023-05-10T16:40:00.000Z',
    updatedAt: '2023-05-12T09:15:00.000Z'
  }
];

// 根据ID获取游记详情
export const getMockDiaryById = (id: string): TravelDiary | undefined => {
  return mockDiaries.find(diary => diary.id === id);
};

// 模拟获取游记列表的API
export const getMockDiaries = (params: {
  status?: DiaryStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}) => {
  let filteredDiaries = [...mockDiaries];
  
  // 状态筛选
  if (params.status && params.status !== 'all') {
    filteredDiaries = filteredDiaries.filter(diary => diary.status === params.status);
  }
  
  // 搜索功能
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredDiaries = filteredDiaries.filter(diary => 
      diary.title.toLowerCase().includes(searchLower) || 
      diary.content.toLowerCase().includes(searchLower) ||
      diary.author.nickname.toLowerCase().includes(searchLower)
    );
  }
  
  // 分页
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDiaries = filteredDiaries.slice(startIndex, endIndex);
  
  // 将TravelDiary数组转换为与API返回格式匹配的结构
  const travel_logs = paginatedDiaries.map(diary => ({
    log_id: parseInt(diary.id),
    title: diary.title,
    first_image_url: diary.images.length > 0 ? diary.images[0] : null,
    cover_url: diary.images.length > 1 ? diary.images[1] : null,
    status: diary.status,
    like_count: 0,
    author: {
      user_id: parseInt(diary.author.id),
      nickname: diary.author.nickname,
      avatar: diary.author.avatar
    },
    auditRecords: []
  }));
  
  return {
    status: 'success',
    message: '获取游记列表成功',
    data: {
      travel_logs: travel_logs,
      pagination: {
        total: filteredDiaries.length,
        page: page,
        limit: limit,
        pages: Math.ceil(filteredDiaries.length / limit)
      }
    }
  };
};

// 模拟审核操作
export const mockAuditDiary = (id: string, status: 'approved' | 'rejected', reason?: string) => {
  const diaryIndex = mockDiaries.findIndex(diary => diary.id === id);
  
  if (diaryIndex === -1) {
    throw new Error('Diary not found');
  }
  
  const diary = mockDiaries[diaryIndex];
  
  // 更新游记状态
  if (status === 'approved') {
    diary.status = DiaryStatus.APPROVED;
    diary.rejectReason = undefined;
  } else {
    diary.status = DiaryStatus.REJECTED;
    diary.rejectReason = reason;
  }
  
  diary.updatedAt = new Date().toISOString();
  
  return {
    status: 'success',
    message: status === 'approved' ? '游记审核通过' : '游记被拒绝',
    data: {
      log_id: diary.id,
      title: diary.title,
      status: diary.status,
      audit_time: diary.updatedAt
    }
  };
}; 