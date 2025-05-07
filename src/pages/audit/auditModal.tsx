import React from 'react';
import { TravelDiary } from '../../types';
import { DiaryStatus } from '../../types';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import DiaryDetail from '../../pages/audit/AuditDetail';
import './auditModal.scss';

interface CustomModalProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  selectedDiary: TravelDiary | null;
  hasPermission: (action: 'approve' | 'reject' | 'delete') => boolean;
  handleApprove: () => void;
  handleReject: () => void;
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
  closeModal
}) => {
  if (!visible || !selectedDiary) {
    return null;
  }

  return (
    <div className="custom-modal-overlay">
      <div 
        className="custom-modal-content" 
        ref={modalRef}
        id={`modal-${selectedDiary.id}`}
      >
        <div className="custom-modal-header">
          <h3>游记详情</h3>
          <button 
            onClick={closeModal} 
            className="close-button"
          >
            ×
          </button>
        </div>
        
        <div className="custom-modal-body">
          <DiaryDetail 
            diary={selectedDiary} 
            getStatusStamp={getStatusStamp} 
          />
        </div>
        
        <div className="custom-modal-footer">
          {selectedDiary.status === DiaryStatus.PENDING ? (
            <div className="modal-footer">
              {hasPermission('approve') && (
                <button 
                  className="modal-button approve-button"
                  onClick={handleApprove}
                >
                  <CheckCircleOutlined /> 批准
                </button>
              )}
              {hasPermission('reject') && (
                <button 
                  className="modal-button reject-button"
                  onClick={handleReject}
                >
                  <CloseCircleOutlined /> 拒绝
                </button>
              )}
              {hasPermission('delete') && (
                <button 
                  className="modal-button delete-button"
                  onClick={handleDelete}
                >
                  <DeleteOutlined /> 删除
                </button>
              )}
            </div>
          ) : hasPermission('delete') ? (
            <div className="modal-footer">
              <button 
                className="modal-button delete-button"
                onClick={handleDelete}
              >
                <DeleteOutlined /> 删除
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CustomModal; 