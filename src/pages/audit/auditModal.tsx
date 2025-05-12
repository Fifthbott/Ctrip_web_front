import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Input, Modal } from 'antd';
import { TravelDiary, DiaryStatus } from '../../types';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  ZoomInOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import './auditModal.scss';

interface CustomModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  selectedDiary: TravelDiary | null;
  hasPermission: (action: 'approve' | 'reject' | 'delete') => boolean;
  handleApprove: (diary: TravelDiary | null) => void;
  handleReject: (diary: TravelDiary | null) => void;
  handleDelete: (diary: TravelDiary | null) => void;
  getStatusStamp: (status: DiaryStatus) => React.ReactNode;
  closeModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  modalRef,
  visible,
  selectedDiary,
  hasPermission,
  handleApprove,
  handleReject,
  handleDelete,
  getStatusStamp,
  closeModal,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [videoPreviewVisible, setVideoPreviewVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPreviewVisible(false);
      setPreviewImage('');
      setVideoPreviewVisible(false);
      setRejectModalVisible(false);
      setRejectReason('');
    }
  }, [visible]);

  // 处理图片预览
  const handlePreview = (image: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  // 处理视频预览
  const handleVideoPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoPreviewVisible(true);
  };

  // 关闭图片预览
  const closePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewVisible(false);
  };

  // 关闭视频预览
  const closeVideoPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoPreviewVisible(false);
  };
  
  // 显示拒绝对话框
  const showRejectModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectModalVisible(true);
  };

  // 确认拒绝
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      Modal.warning({
        title: '请输入拒绝理由',
        content: '拒绝游记时必须提供拒绝理由'
      });
      return;
    }
    
    if (selectedDiary) {
      // 将拒绝理由添加到日记对象中
      const diaryWithReason = {
        ...selectedDiary,
        rejectReason
      };
      handleReject(diaryWithReason);
    }
    
    setRejectModalVisible(false);
    setRejectReason('');
  };
  
  // 使用useMemo缓存图片和视频渲染，将其提升到组件级别
  const renderImagesAndVideo = useMemo(() => {
    // 如果没有图片和视频，则不显示
    if ((!selectedDiary?.images || selectedDiary.images.length === 0) && !selectedDiary?.video) return null;
    
    return (
      <div className="diary-images-section">
        <div className="content-header">
          <Typography.Title level={5}>游记视频/图片</Typography.Title>
        </div>
        
        <div className="diary-images">
          <div className="images-row">
            {/* 视频缩略图 */}
            {selectedDiary?.video && (
              <div className="image-col">
                <div 
                  className="image-wrapper video-wrapper" 
                  onClick={handleVideoPreview}
                >
                  <div className="video-thumbnail">
                    <img 
                      className="diary-image"
                      src={selectedDiary.coverImage || (selectedDiary.images && selectedDiary.images.length > 0 ? selectedDiary.images[0] : '')}
                      alt="视频封面"
                      loading="lazy"
                    />
                    <div className="play-icon">
                      <PlayCircleOutlined />
                    </div>
                  </div>
                  <div className="preview-overlay">
                    <span className="preview-text"><PlayCircleOutlined /> 播放视频</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 图片显示 */}
            {selectedDiary?.images && selectedDiary.images.length > 0 && (
              selectedDiary.images.map((image, index) => (
              <div key={`${image}-${index}`} className="image-col">
                <div 
                  className="image-wrapper" 
                  onClick={(e) => handlePreview(image, e)}
                >
                  <img 
                    className="diary-image" 
                    src={image} 
                    alt={`游记图片 ${index + 1}`} 
                    loading="lazy"
                  />
                  <div className="preview-overlay">
                    <span className="preview-text"><ZoomInOutlined /> 预览</span>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }, [selectedDiary, handlePreview, handleVideoPreview]);
  
  // 渲染笔记详情部分
  const renderDiaryContent = () => {
    if (!selectedDiary) return null;
    
    return (
      <>
        <div className="custom-modal-header">
          <div className="header-left">
            <Typography.Title level={4}>{selectedDiary.title}</Typography.Title>
          </div>
          <button className="close-button" onClick={closeModal}>
            <CloseOutlined />
          </button>
        </div>
        
        <div className="custom-modal-body">
          <div className="diary-info">
            <div className="diary-author">
              <div className="author-avatar">
                <img src={selectedDiary.author.avatar} alt={selectedDiary.author.nickname} />
              </div>
              <div className="author-info">
                <span className="author-name">{selectedDiary.author.nickname}</span>
                <span className="create-time">
                  <ClockCircleOutlined /> {new Date(selectedDiary.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
              <div className="diary-status">
                {getStatusStamp(selectedDiary.status)}
              </div>
            </div>
          </div>
          
          <div className="diary-content-section">
            <div className="content-header">
              <Typography.Title level={5}>游记内容</Typography.Title>
            </div>
            <div className="diary-content">
              {selectedDiary.content || '暂无内容'}
            </div>
          </div>
          
          {renderImagesAndVideo}
          
          {selectedDiary.rejectReason && (
            <div className="reject-reason-section">
              <div className="content-header">
                <Typography.Title level={5}>拒绝原因</Typography.Title>
              </div>
              <div className="reject-reason">
                <Typography.Text type="danger">
                  <CloseCircleOutlined style={{ marginRight: '8px' }} />
                  {selectedDiary.rejectReason}
                </Typography.Text>
              </div>
            </div>
          )}
        </div>
        
        <div className="custom-modal-footer">
          <div className="modal-footer">
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('approve') && (
              <button className="modal-button approve-button" onClick={() => handleApprove(selectedDiary)}>
                <CheckCircleOutlined /> 批准
              </button>
            )}
            
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('reject') && (
              <button className="modal-button reject-button" onClick={showRejectModal}>
                <CloseCircleOutlined /> 拒绝
              </button>
            )}
            
            {hasPermission('delete') && (
              <button className="modal-button delete-button" onClick={() => handleDelete(selectedDiary)}>
                <DeleteOutlined /> 删除
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  if (!visible) return null;

  return (
    <>
      <div className="custom-modal visible">
        <div className="modal-overlay" onClick={closeModal} />
        <div className="modal-content" ref={modalRef}>
          {selectedDiary && renderDiaryContent()}
        </div>
      </div>

      {/* 图片预览模态框 */}
      {previewVisible && (
        <div className="preview-modal-container">
          <div className="preview-modal-backdrop" onClick={closePreview} />
          <div className="preview-modal-content">
            <div className="image-wrapper">
              <img 
                src={previewImage} 
                alt="预览图片" 
                className="preview-modal-image"
              />
              <button className="preview-modal-close" onClick={closePreview}>
                <CloseOutlined />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 视频预览模态框 */}
      {videoPreviewVisible && selectedDiary?.video && (
        <div className="preview-modal-container video-preview-container">
          <div className="preview-modal-backdrop" onClick={closeVideoPreview} />
          <div className="preview-modal-content video-preview-content">
            <div className="video-preview-wrapper">
              <video 
                className="preview-modal-video"
                controls
                autoPlay
                preload="auto"
                src={selectedDiary.video}
              >
                您的浏览器不支持视频播放
              </video>
              <button className="preview-modal-close" onClick={closeVideoPreview}>
                <CloseOutlined />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拒绝理由模态框 */}
      <Modal
        title="拒绝理由"
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => setRejectModalVisible(false)}
        destroyOnClose
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入拒绝理由"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default CustomModal; 