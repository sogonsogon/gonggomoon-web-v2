import { Button } from '@/shared/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';

interface ModalTestProps {
  open: boolean;
  setOpen: (next: boolean) => void;
}

export default function ExperienceModalTest({ open, setOpen }: ModalTestProps) {
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent size="md">
        <ModalHeader title="경험 등록" description="경험을 직접 작성하고 등록하세요" />
        <div>...</div>
        <ModalFooter>
          <Button variant="outline" size="sm">
            취소
          </Button>
          <Button size="sm">저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
