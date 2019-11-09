// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';
import { ReactElement } from 'react';

import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import { Icon as BPIcon, IIconProps } from '@blueprintjs/core/lib/cjs/components/icon/icon';
import { Tabs as IBPTabs, ITabsProps as IBPTabsProps } from '@blueprintjs/core/lib/cjs/components/tabs/tabs';
import { Tab as IBPTab } from '@blueprintjs/core/lib/cjs/components/tabs/tab';
import { Collapse as BPCollapse, ICollapseProps } from '@blueprintjs/core/lib/cjs/components/collapse/collapse';
import { Select as BPSelect, ISelectProps } from '@blueprintjs/select/lib/cjs/components/select/select';

import {
  Button as BPButton,
  IButtonProps as IBPButtonProps,
} from '@blueprintjs/core/lib/cjs/components/button/buttons';
import {
  Tooltip as BPTooltip,
  ITooltipProps as IBPTooltip,
} from '@blueprintjs/core/lib/cjs/components/tooltip/tooltip';
import {
  InputGroup as BPInputGroup,
  IInputGroupProps as IBPInputGroupProps,
} from '@blueprintjs/core/lib/cjs/components/forms/inputGroup';
import {
  FormGroup as BPFormGroup,
  IFormGroupProps as IBPFormGroupProps,
} from '@blueprintjs/core/lib/cjs/components/forms/formGroup';
import {
  HTMLSelect as BPHTMLSelect,
  IHTMLSelectProps,
} from '@blueprintjs/core/lib/cjs/components/html-select/htmlSelect';

import { combineClasses } from './utils';

interface IButtonProps extends IBPButtonProps {
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface IInputGroupProps extends IBPInputGroupProps {
  rightIcon?: IIconProps['icon'];
}

type CommonProps<T> = React.DOMAttributes<T>;

export { BPIcon, Intent };

export const Button = (props: IButtonProps & CommonProps<any>) => (
  <BPButton {...props} className={combineClasses(props.className, props.minimal && 'minimal', 'm-Button')} />
);

export const FormGroup: React.FC<IBPFormGroupProps> = props => {
  return (
    <BPFormGroup {...props} className={combineClasses(props.className, 'm-FormGroup')}>
      {props.children}
    </BPFormGroup>
  );
};

export const Tabs: React.FC<IBPTabsProps & Tabs.IProps> = props => {
  return (
    <IBPTabs {...props} className={combineClasses(props.className, 'm-Tabs')}>
      {props.tabs.map(value => (
        <IBPTab key={value.tabId} id={value.tabId} title={value.title} panel={value.panel} />
      ))}
    </IBPTabs>
  );
};

export namespace Tabs {
  export interface IProps {
    onChange(id: string): void;
    tabs: ITab[];
  }

  export interface ITab {
    tabId: string;
    title: string;
    panel: ReactElement<any> | null;
  }
}

export const InputGroup = (props: IInputGroupProps & CommonProps<any>) => {
  if (props.rightIcon) {
    return (
      <BPInputGroup
        {...props}
        className={combineClasses(props.className, 'm-InputGroup')}
        rightElement={
          <div className="m-InputGroupAction">
            <BPIcon className={'m-Icon'} icon={props.rightIcon} />
          </div>
        }
      />
    );
  }
  return <BPInputGroup {...props} className={combineClasses(props.className, 'm-InputGroup')} />;
};

export const Collapse = (props: ICollapseProps & CommonProps<any>) => <BPCollapse {...props} />;

export const Tooltip = (props: IBPTooltip) => <BPTooltip {...props} />;

export const HTMLSelect = (props: IHTMLSelectProps & CommonProps<any>) => (
  <BPHTMLSelect {...props} className={combineClasses(props.className, 'm-HTMLSelect')} />
);

export const Select = (props: ISelectProps<any> & CommonProps<any>) => (
  <BPSelect {...props} className={combineClasses(props.className, 'm-Select')} />
);
