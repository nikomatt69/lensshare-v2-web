import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Errors } from '@lensshare/data/errors';
import {
  NftGalleriesDocument,
  useCreateNftGalleryMutation,
  useNftGalleriesLazyQuery,
  useUpdateNftGalleryInfoMutation,
  useUpdateNftGalleryItemsMutation
} from '@lensshare/lens';
import { useApolloClient } from '@lensshare/lens/apollo';
import trimify from '@lensshare/lib/trimify';
import { Button, Input, Modal, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { useNftGalleryStore } from 'src/store/useNftGalleryStore';

import Picker from './Picker';
import ReviewSelection from './ReviewSelection';

enum CreateSteps {
  NAME = 'NAME',
  PICK_NFTS = 'PICK_NFTS',
  REVIEW = 'REVIEW'
}

interface CreateProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const Create: FC<CreateProps> = ({ showModal, setShowModal }) => {
  const [currentStep, setCurrentStep] = useState<CreateSteps>(CreateSteps.NAME);
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { cache } = useApolloClient();
  const [createGallery, { loading }] = useCreateNftGalleryMutation();
  const [updateGallery, { loading: updating }] =
    useUpdateNftGalleryItemsMutation();
  const [renameGallery, { loading: renaming }] =
    useUpdateNftGalleryInfoMutation();
  const [fetchNftGalleries] = useNftGalleriesLazyQuery();

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(CreateSteps.NAME);
    setGallery({ ...gallery, name: '', items: [] });
  };

  const create = async () => {
    try {
      const sanitizedItems = gallery.items.map((el) => {
        return { contract: el.contract, tokenId: el.tokenId };
      });
      const { data } = await createGallery({
        variables: {
          request: { items: sanitizedItems, name: gallery.name }
        }
      });
      if (data?.createNftGallery) {
        const { data } = await fetchNftGalleries({
          variables: { request: { for: currentProfile?.id } }
        });
        cache.modify({
          fields: {
            nftGalleries: () => {
              cache.writeQuery({
                data: data?.nftGalleries,
                query: NftGalleriesDocument
              });
            }
          }
        });
        closeModal();
        toast.success('Gallery created');
      }
    } catch (error: any) {
      toast.error(error?.messaage ?? Errors.SomethingWentWrong);
    }
  };

  const rename = async () => {
    try {
      const { data } = await renameGallery({
        variables: {
          request: { name: gallery.name, galleryId: gallery.id }
        }
      });
      if (data) {
        cache.modify({
          fields: {
            nftGalleries: () => {
              cache.updateQuery({ query: NftGalleriesDocument }, () => ({
                data: gallery
              }));
            }
          }
        });
        closeModal();
        toast.success('Gallery name updated');
      }
    } catch (error: any) {
      toast.error(error?.messaage ?? Errors.SomethingWentWrong);
    }
  };

  const update = async () => {
    try {
      const newlyAddedItems = gallery.toAdd?.filter(
        (value) =>
          value.itemId !==
          gallery.alreadySelectedItems.find((t) => t.itemId === value.itemId)
            ?.itemId
      );
      const newlyRemovedItems = gallery.toRemove?.filter(
        (value) =>
          value.itemId ===
          gallery.alreadySelectedItems.find((t) => t.itemId === value.itemId)
            ?.itemId
      );
      const sanitizedAddItems = newlyAddedItems?.map((el) => {
        return { contract: el.contract, tokenId: el.tokenId };
      });
      const sanitizedRemoveItems = newlyRemovedItems?.map((el) => {
        return { contract: el.contract, tokenId: el.tokenId };
      });

      // if gallery name only update
      if (!sanitizedAddItems.length && !sanitizedRemoveItems.length) {
        return await rename();
      }
      const { data } = await updateGallery({
        variables: {
          request: {
            galleryId: gallery.id,
            toAdd: sanitizedAddItems,
            toRemove: sanitizedRemoveItems
          }
        }
      });
      if (data) {
        const { data } = await fetchNftGalleries({
          variables: { request: { for: currentProfile?.id } }
        });
        cache.modify({
          fields: {
            nftGalleries: () => {
              cache.updateQuery({ query: NftGalleriesDocument }, () => ({
                data: data?.nftGalleries
              }));
            }
          }
        });
        closeModal();
        toast.success('Gallery updated');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const onClickNext = () => {
    const galleryName = trimify(gallery.name);
    if (galleryName.length > 255) {
      return toast.error('Gallery name should be less than 255 characters');
    } else if (!galleryName.length) {
      return toast.error('Gallery name required');
    } else if (
      !gallery.items.length &&
      (currentStep === CreateSteps.REVIEW ||
        currentStep === CreateSteps.PICK_NFTS)
    ) {
      return toast.error('Select collectibles for your gallery');
    }

    if (currentStep === CreateSteps.NAME) {
      setCurrentStep(CreateSteps.PICK_NFTS);
    } else if (currentStep === CreateSteps.PICK_NFTS) {
      setCurrentStep(CreateSteps.REVIEW);
    } else if (currentStep === CreateSteps.REVIEW) {
      return gallery.isEdit ? update() : create();
    } else {
      setCurrentStep(CreateSteps.NAME);
    }
  };

  const getBackStep = () => {
    if (currentStep === CreateSteps.REVIEW) {
      return CreateSteps.PICK_NFTS;
    } else if (currentStep === CreateSteps.PICK_NFTS) {
      return CreateSteps.NAME;
    } else {
      return CreateSteps.NAME;
    }
  };

  const getModalTitle = () => {
    if (
      currentStep === CreateSteps.PICK_NFTS ||
      currentStep === CreateSteps.REVIEW
    ) {
      return (
        <div className="flex items-center space-x-1">
          <button type="button" onClick={() => setCurrentStep(getBackStep())}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span>
            {currentStep === CreateSteps.REVIEW
              ? 'Review collection'
              : 'Select collectibles you want others to see'}
          </span>
        </div>
      );
    }

    return "What's your gallery name?";
  };

  const loadingNext = loading || updating || renaming;

  return (
    <Modal
      size="lg"
      title={getModalTitle()}
      show={showModal}
      onClose={closeModal}
    >
      <div className={cn(currentStep === CreateSteps.NAME ? 'p-5' : 'p-0')}>
        {currentStep === CreateSteps.NAME ? (
          <Input
            value={gallery.name}
            placeholder="Gallery name"
            onChange={(event) =>
              setGallery({
                ...gallery,
                name: event.target.value,
                items: gallery.items
              })
            }
          />
        ) : currentStep === CreateSteps.PICK_NFTS ? (
          <Picker />
        ) : (
          <ReviewSelection />
        )}
      </div>
      <div className="flex items-center justify-between space-x-2 border-t p-5 px-5 py-3 dark:border-t-gray-700">
        {currentStep === 'NAME' ? <div /> : `${gallery.items.length} selected`}
        <Button
          disabled={loadingNext}
          onClick={() => onClickNext()}
          icon={loadingNext ? <Spinner size="xs" /> : null}
        >
          Next
        </Button>
      </div>
    </Modal>
  );
};

export default Create;
