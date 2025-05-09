import React from 'react';
import { Modal, Typography, Space, Button } from 'antd';
import { TravelDiary, DiaryStatus } from '../../types';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import DiaryDetail from '../../pages/audit/AuditDetail';
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
  if (!selectedDiary) return null;

  return (
    <div className={`custom-modal ${visible ? 'visible' : ''}`}>
      <div className="modal-overlay" onClick={closeModal} />
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <Typography.Title level={4}>{selectedDiary.title}</Typography.Title>
          {getStatusStamp(selectedDiary.status)}
        </div>
        
        <div className="modal-body">
          <div className="diary-author">
            <img src={selectedDiary.author.avatar} alt={selectedDiary.author.nickname} />
            <span>{selectedDiary.author.nickname}</span>
          </div>
          
          <div className="diary-content">
            {selectedDiary.content}
          </div>
          
          {selectedDiary.images.length > 0 && (
            <div className="diary-images">
              {selectedDiary.images.map((image, index) => (
                <img key={index} src={image} alt={`游记图片 ${index + 1}`} />
              ))}
            </div>
          )}
          
          {selectedDiary.status === DiaryStatus.REJECTED && selectedDiary.rejectReason && (
            <div className="reject-reason">
              <Typography.Text type="danger">
                拒绝原因：{selectedDiary.rejectReason}
              </Typography.Text>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <Space>
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('approve') && (
              <Button type="primary" onClick={handleApprove}>
                批准
              </Button>
            )}
            
            {selectedDiary.status === DiaryStatus.PENDING && hasPermission('reject') && (
              <Button danger onClick={() => handleReject('内容不符合规范')}>
                拒绝
              </Button>
            )}
            
            {hasPermission('delete') && (
              <Button danger onClick={handleDelete}>
                删除
              </Button>
            )}
            
            <Button onClick={closeModal}>
              关闭
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default CustomModal; 