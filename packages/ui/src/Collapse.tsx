import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { RowSpacingIcon, Cross2Icon } from '@radix-ui/react-icons';

const CollapsibleDemo = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root className="w-[300px]" open={open} onOpenChange={setOpen}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          className="text-violet11 text-[15px] leading-[25px]"
          style={{ color: 'white' }}
        >
          @peduarte starred 3 repositories
        </span>
        <Collapsible.Trigger asChild>
          <button className="text-violet11 shadow-blackA4 data-[state=open]:bg-violet3 hover:bg-violet3 inline-flex h-[25px] w-[25px] items-center justify-center rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=closed]:bg-white">
            {open ? <Cross2Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger>
      </div>

      <div className="shadow-blackA4 my-[10px] rounded bg-white p-[10px] shadow-[0_2px_10px]">
        <span className="text-violet11 text-[15px] leading-[25px]">
          @radix-ui/primitives
        </span>
      </div>

      <Collapsible.Content>
        <div className="shadow-blackA4 my-[10px] rounded bg-white p-[10px] shadow-[0_2px_10px]">
          <span className="text-violet11 text-[15px] leading-[25px]">
            @radix-ui/colors
          </span>
        </div>
        <div className="shadow-blackA4 my-[10px] rounded bg-white p-[10px] shadow-[0_2px_10px]">
          <span className="text-violet11 text-[15px] leading-[25px]">
            @stitches/react
          </span>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleDemo;
