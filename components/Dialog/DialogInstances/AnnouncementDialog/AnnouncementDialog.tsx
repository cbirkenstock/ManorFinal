import React from "react";
import Dialog from "../../Dialog";
import AnnouncementCreationForm from "../../DialogForms/AnnouncementCreationForm/AnnouncementCreationForm";

interface AnnouncementDialogProps {
  isAnnouncementDialogVisible: boolean;
  setIsAnnouncementDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setHasSentAnnouncement: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function AnnouncementDialog(props: AnnouncementDialogProps) {
  const {
    isAnnouncementDialogVisible,
    setIsAnnouncementDialogVisible,
    setHasSentAnnouncement,
  } = props;
  return (
    <Dialog
      title="Add Announcement"
      width={350}
      visible={isAnnouncementDialogVisible}
      children={
        <AnnouncementCreationForm
          onSubmit={() => {
            setHasSentAnnouncement(true);
            setIsAnnouncementDialogVisible(false);
          }}
        />
      }
      onClose={() => {
        setIsAnnouncementDialogVisible(false);
      }}
    />
  );
}
