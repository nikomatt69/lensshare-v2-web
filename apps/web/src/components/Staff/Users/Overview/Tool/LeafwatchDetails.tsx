import type { FC } from 'react';

import {
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@lensshare/data/constants';
import humanize from '@lensshare/lib/humanize';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MetaDetails from '@components/StaffTools/Panels/MetaDetails';



interface LeafwatchDetailsProps {
  profileId: string;
}

const LeafwatchDetails: FC<LeafwatchDetailsProps> = ({ profileId }) => {
  const getProfileDetails = async (): Promise<{
    browser: string;
    city: string;
    country: string;
    events: number;
    os: string;
    region: string;
    version: string;
  } | null> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/details`,
        { params: { id: profileId } }
      );
      const { data } = response;

      return data.result;
    } catch {
      return null;
    }
  };

  const { data: leafwatchDetails } = useQuery({
    enabled: Boolean(profileId),
    queryFn: getProfileDetails,
    queryKey: ['getProfileDetails', profileId]
  });

  const getProfileImpressions = async (): Promise<{
    totalImpressions: number;
  } | null> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/impressions`,
        { params: { id: profileId } }
      );
      const { data } = response;

      return data;
    } catch {
      return null;
    }
  };

  const { data: impressionDetails } = useQuery({
    enabled: Boolean(profileId),
    queryFn: getProfileImpressions,
    queryKey: ['getProfileImpressions', profileId]
  });

  if (!leafwatchDetails || !impressionDetails) {
    return null;
  }

  return (
    <>
      <div className="divider my-5 border-dashed border-yellow-600" />
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="size-5" />
        <div className="text-lg font-bold">Leafwatch Details</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <MetaDetails
          icon={<EyeIcon className="ld-text-gray-500 size-4" />}
          title="Impressions"
          value={''}
        >
          {humanize(impressionDetails.totalImpressions)}
        </MetaDetails>
        <MetaDetails
          icon={<CursorArrowRaysIcon className="ld-text-gray-500 size-4" />}
          title="Total events"
          value={''}
        >
          {humanize(leafwatchDetails.events)}
        </MetaDetails>
        <MetaDetails
          icon={<MapPinIcon className="ld-text-gray-500 size-4" />}
          title="Location"
          value={''}
        >
          {leafwatchDetails.city}, {leafwatchDetails.region},{' '}
          {leafwatchDetails.country}
        </MetaDetails>
        <MetaDetails
          icon={<ComputerDesktopIcon className="ld-text-gray-500 size-4" />}
          title="OS"
          value={''}
        >
          {leafwatchDetails.os}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="ld-text-gray-500 size-4" />}
          title="Browser"
          value={''}
        >
          {leafwatchDetails.browser} {leafwatchDetails.version}
        </MetaDetails>
      </div>
    </>
  );
};

export default LeafwatchDetails;
