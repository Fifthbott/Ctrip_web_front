import { TravelDiary, DiaryStatus } from '../types';
import testImg from '../assets/images/test.jpeg';

// 模拟游记数据
export const mockDiaries: TravelDiary[] = [
  {
    id: '1',
    title: '三亚五日游',
    content: '三亚是一个美丽的城市，有着蓝天白云和清澈的海水。这次旅行我体验了很多海上活动，包括潜水、冲浪和帆船。天气晴朗，海滩上人来人往，非常热闹。住的酒店服务也很好，早餐种类丰富。总的来说，这是一次非常愉快的旅行。',
    images: [
      testImg,
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '101',
      username: 'user1',
      nickname: '旅行达人',
      avatar: 'https://joeschmoe.io/api/v1/male/1'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-05-15T09:24:00Z',
    updatedAt: '2023-05-15T09:24:00Z'
  },
  {
    id: '2',
    title: '北京文化之旅',
    content: '北京是一座历史悠久的城市，有着丰富的文化遗产和现代都市风貌。参观了故宫、长城和颐和园等著名景点，感受到了深厚的历史文化底蕴。特别是故宫的建筑风格和内部陈设，展现了中国古代宫廷的奢华与精致。',
    images: [
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '102',
      username: 'user2',
      nickname: '文化探索者',
      avatar: 'https://joeschmoe.io/api/v1/male/2'
    },
    status: DiaryStatus.APPROVED,
    createdAt: '2023-06-20T14:30:00Z',
    updatedAt: '2023-06-21T10:15:00Z'
  },
  {
    id: '3',
    title: '上海美食之旅',
    content: '上海的美食种类繁多，融合了中西方多种风味。品尝了正宗的上海小笼包、生煎馒头和炒年糕，每一样都让人回味无穷。南京路步行街的夜景也非常美丽，各种霓虹灯照亮了整条街道，非常热闹。',
    images: [
      testImg
    ],
    video: '',
    author: {
      id: '103',
      username: 'user3',
      nickname: '美食猎人',
      avatar: 'https://joeschmoe.io/api/v1/female/1'
    },
    status: DiaryStatus.REJECTED,
    rejectReason: '内容与旅游主题不符，更偏向美食攻略。',
    createdAt: '2023-07-05T18:45:00Z',
    updatedAt: '2023-07-06T09:20:00Z'
  },
  {
    id: '4',
    title: '杭州西湖游记',
    content: '西湖美景令人陶醉，湖水清澈，周围群山环绕，景色宜人。划着小船在湖中央，感受微风拂面，十分惬意。苏堤和白堤上的柳树随风摇曳，景色如画。特别推荐黄昏时分的断桥，夕阳西下的余晖映照在湖面上，美不胜收。',
    images: [
      testImg,
      testImg,
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '104',
      username: 'user4',
      nickname: '风景摄影师',
      avatar: 'https://joeschmoe.io/api/v1/male/3'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-08-10T11:30:00Z',
    updatedAt: '2023-08-10T11:30:00Z'
  },
  {
    id: '5',
    title: '云南民族风情游',
    content: '云南的民族文化多姿多彩，参观了几个少数民族村寨，领略了不同的民族服饰和生活习俗。大理的洱海风光秀丽，丽江古城保存完好，处处充满古朴的韵味。当地的美食也很特别，过桥米线和破酥包非常好吃。',
    images: [
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '105',
      username: 'user5',
      nickname: '文化爱好者',
      avatar: 'https://joeschmoe.io/api/v1/female/2'
    },
    status: DiaryStatus.APPROVED,
    createdAt: '2023-09-02T16:20:00Z',
    updatedAt: '2023-09-03T08:45:00Z'
  }
];

// 模拟 API 响应
export const mockApiResponse = {
  data: mockDiaries,
  total: mockDiaries.length,
  page: 1,
  pageSize: 5
};

// 模拟 API 延迟
export const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 API 错误
export const mockError = new Error('模拟 API 错误');

// 模拟 API 响应函数
export const mockGetDiaries = async (params: {
  status?: DiaryStatus | 'all';
  searchKeyword?: string;
  searchType?: 'title' | 'author' | 'content' | 'all';
  page?: number;
  pageSize?: number;
}) => {
  // 模拟网络延迟
  await mockDelay(500);

  let filteredData = [...mockDiaries];

  // 根据状态过滤
  if (params.status && params.status !== 'all') {
    filteredData = filteredData.filter(diary => diary.status === params.status);
  }

  // 根据搜索词过滤
  if (params.searchKeyword) {
    const keyword = params.searchKeyword.toLowerCase();
    filteredData = filteredData.filter(diary => {
      if (params.searchType === 'title' && diary.title.toLowerCase().includes(keyword)) {
        return true;
      }
      if (params.searchType === 'author' && diary.author.nickname.toLowerCase().includes(keyword)) {
        return true;
      }
      if (params.searchType === 'content' && diary.content.toLowerCase().includes(keyword)) {
        return true;
      }
      if (params.searchType === 'all') {
        return diary.title.toLowerCase().includes(keyword) ||
          diary.author.nickname.toLowerCase().includes(keyword) ||
          diary.content.toLowerCase().includes(keyword);
      }
      return false;
    });
  }

  // 分页处理
  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filteredData.slice(start, end);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    pageSize
  };
}; 