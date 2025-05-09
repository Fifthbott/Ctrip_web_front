import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { TravelDiary, DiaryStatus } from '../../types';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  ZoomInOutlined
} from '@ant-design/icons';
import './auditModal.scss';

interface CustomModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  selectedDiary: TravelDiary | null;
  hasPermission: (action: 'approve' | 'reject' | 'delete') => boolean;
  handleApprove: () => void;
  handleReject: (reason: string) => void;
  handleDelete: () => void;
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

  useEffect(() => {
    if (!visible) {
      setPreviewVisible(false);
      setPreviewImage('');
    }
  }, [visible]);

  // 处理图片预览
  const handlePreview = (image: string, e: React.MouseEvent) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  // 关闭图片预览
  const closePreview = (e: React.MouseEvent) => {
    setPreviewVisible(false);
  };
  
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
              {selectedDiary.content}
            </div>
          </div>
          
          {selectedDiary.images.length > 0 && (
            <div className="diary-images-section">
              <div className="content-header">
                <Typography.Title level={5}>游记图片</Typography.Title>
              </div>
              <div className="diary-images">
                <div className="images-row">
                  {selectedDiary.images.map((image, index) => (
                    <div key={index} className="image-col">
                      <div 
                        className="image-wrapper" 
                        onClick={(e) => handlePreview(image, e)}
                      >
                        <img className="diary-image" src={image} alt={`游记图片 ${index + 1}`} />
                        <div className="preview-overlay">
                          <span className="preview-text"><ZoomInOutlined /> 预览</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {selectedDiary.status === DiaryStatus.REJECTED && selectedDiary.rejectReason && (
            <div className="reject-reason-section">
              <div className="content-header">
                <Typography.Title level={5}>拒绝原因</Typography.Title>
              </div>
              <div className="reject-reason">
                <Typography.Text type="danger">
                  {selectedDiary.rejectReason}
                </Typography.Text>
              </div>
            </div>
          )}
        </div>
        
        <div className="custom-modal-footer">
          <div className="modal-footer">
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('approve') && (
              <button className="modal-button approve-button" onClick={handleApprove}>
                <CheckCircleOutlined /> 批准
              </button>
            )}
            
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('reject') && (
              <button className="modal-button reject-button" onClick={() => handleReject('内容不符合规范')}>
                <CloseCircleOutlined /> 拒绝
              </button>
            )}
            
            {hasPermission('delete') && (
              <button className="modal-button delete-button" onClick={handleDelete}>
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
    </>
  );
};

export default CustomModal; 