import { useMemo } from "react";
import { DiaryStatus, TravelDiary } from "../../types";
import { 
    Typography, 
    Card,
    Image,
    Avatar
  } from 'antd';

 const { Title, Paragraph } = Typography;

 const DiaryDetail = ({ diary, getStatusStamp }: { 
    diary: TravelDiary;
    getStatusStamp: (status: DiaryStatus) => React.ReactNode;
  }) => {
    
    // 使用图片列表，避免使用可能导致循环渲染的组件
    const imagesPreview = useMemo(() => {
      if (diary.images.length === 0) return null;
      
      return (
        <div className="diary-images">
          <Image.PreviewGroup>
            <div className="images-row">
              {diary.images.map((image, index) => (
                <div key={index} className="image-col">
                  <Image
                    src={image} 
                    alt={`图片 ${index + 1}`} 
                    className="diary-image"
                    width="100%"
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }, [diary.images]);
    
    return (
      <div className="diary-detail">
        <Title level={4}>{diary.title}</Title>
        
        <div className="diary-meta">
          <div className="diary-author">
            <Avatar 
              src={diary.author.avatar} 
              alt={diary.author.nickname} 
              size={32}
            />
            <span>{diary.author.nickname}</span>
          </div>
          <div className="diary-status">
            {getStatusStamp(diary.status)}
            <span className="diary-date">
              {new Date(diary.createdAt).toLocaleString('zh-CN')}
            </span>
          </div>
        </div>
        
        {diary.status === DiaryStatus.REJECTED && diary.rejectReason && (
          <div className="reject-reason">
            <Typography.Text type="danger">
              拒绝原因: {diary.rejectReason}
            </Typography.Text>
          </div>
        )}
        
        <div className="diary-content">
          <Paragraph>{diary.content}</Paragraph>
          
          {imagesPreview}
          
          {diary.video && (
            <div className="diary-video">
              <Card 
                title="视频内容" 
                bordered={false}
                className="video-card"
              >
                <video controls width="100%">
                  <source src={diary.video} type="video/mp4" />
                  您的浏览器不支持视频播放
                </video>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };
  export default DiaryDetail;