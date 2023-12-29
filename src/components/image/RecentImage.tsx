/**
 * Copyright 2023 Eugene Khyst
 * SPDX-License-Identifier: Apache-2.0
 */

import {DeleteOutlined} from '@ant-design/icons';
import {Button, Card, Popconfirm} from 'antd';
import * as dayjs from 'dayjs';
import {Dispatch, SetStateAction} from 'react';
import {useCreateObjectUrl} from '../../hooks/useCreateObjectUrl';
import {ImageFile} from '../../services/db';

type Props = {
  imageFile: ImageFile;
  deleteRecentImage: (id?: number) => void;
  setBlob: Dispatch<SetStateAction<Blob | undefined>>;
};

export const RecentImage: React.FC<Props> = ({
  imageFile: {id, file, date},
  deleteRecentImage,
  setBlob,
}: Props) => {
  const imageSrc: string | undefined = useCreateObjectUrl(file);
  const dateStr: string | undefined = date && dayjs(date).format('DD/MM/YYYY');

  const handleCardClick = () => {
    setBlob(file);
  };

  const handleDeleteButtonClick = () => {
    deleteRecentImage(id);
  };

  return (
    imageSrc && (
      <Card
        hoverable
        onClick={handleCardClick}
        cover={<img src={imageSrc} alt={file.name} />}
        actions={[
          <Popconfirm
            key="delete"
            title="Delete the recent photo"
            description="Are you sure to delete this recent photo?"
            onPopupClick={e => e.stopPropagation()}
            onConfirm={e => {
              e?.stopPropagation();
              handleDeleteButtonClick();
            }}
            onCancel={e => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} onClick={e => e.stopPropagation()}>
              Delete
            </Button>
          </Popconfirm>,
        ]}
      >
        <Card.Meta title={file.name} description={`Loaded on ${dateStr}`} />
      </Card>
    )
  );
};
