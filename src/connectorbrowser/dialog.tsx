import * as React from 'react';

import { Dialog, ReactWidget, UseSignal } from '@mochi/apputils';
import { FormGroup, InputGroup, Tabs } from '@mochi/ui-components';

import { DatabaseBrowserModel } from './model';
import { toArray } from '@phosphor/algorithm';
import { Signal } from '@phosphor/signaling';

export class NewConnectionDialogBody extends ReactWidget implements Dialog.IBodyWidget<BrowserDialog.IConnection> {
  constructor(private readonly options: NewConnectionDialogBody.IOptions) {
    super();

    if (options.value) {
      this._value = options.value;
    }
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    Signal.clearData(this);
  }

  getValue(): BrowserDialog.IConnection {
    return this._value;
  }

  render() {
    return (
      <UseSignal
        signal={this._onValueUpdated}
        children={() => (
          <NewConnectionDialog
            value={this._value}
            model={this.options.model}
            onUpdate={(p, v) => this._updateValue(p, v)}
          />
        )}
      />
    );
  }

  private _updateValue(property: keyof BrowserDialog.IConnection, value: string): void {
    this._value[property] = value;
    this._onValueUpdated.emit(void 0);
  }

  private _onValueUpdated = new Signal<this, void>(this);
  private _isDisposed = false;

  /**
   * Default values for new connection...
   */
  private _value: BrowserDialog.IConnection = {
    type: '',
    name: '',
    user: '',
    password: '',
    database: '',
    hostname: '',
    port: '',
  };
}

export namespace NewConnectionDialogBody {
  export interface IOptions {
    model: DatabaseBrowserModel;
    value?: BrowserDialog.IConnection;
  }
}

/**
 * Body of new connection dialog.
 */
class NewConnectionDialog extends React.Component<NewConnectionDialog.IProps> {
  private _general = () => (
    <React.Fragment>
      <FormGroup label='User:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          value={this.props.value['user']}
          onChange={e => this.props.onUpdate('user', e.target.value)}
        />
      </FormGroup>

      <FormGroup label='Password:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          placeholder='<hidden>'
          value={this.props.value['password']}
          onChange={e => this.props.onUpdate('password', e.target.value)}
        />
      </FormGroup>

      <FormGroup label='Database:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          value={this.props.value['database']}
          onChange={e => this.props.onUpdate('database', e.target.value)}
        />
      </FormGroup>

      <FormGroup label='Hostname:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          value={this.props.value['hostname']}
          onChange={e => this.props.onUpdate('hostname', e.target.value)}
        />
      </FormGroup>
      <FormGroup label='Port:' inline={true}>
        <InputGroup
          type='number'
          fill={true}
          value={this.props.value['port']}
          onChange={e => this.props.onUpdate('port', e.target.value)}
        />
      </FormGroup>
    </React.Fragment>
  )

  private _SSL = () => <React.Fragment>SSL</React.Fragment>;

  private _categories = (): Tabs.ITab[] => [
    {
      tabId: 'general',
      title: 'General',
      panel: this._general(),
    },
    {
      tabId: 'ssl',
      title: 'SSL',
      panel: this._SSL(),
    },
  ]

  private _panel = () => (
    <div className='m-NewConnectionDialog-panel'>
      <FormGroup label='Name:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          value={this.props.value['name']}
          onChange={e => this.props.onUpdate('name', e.target.value)}
        />
      </FormGroup>

      <Tabs id='m-newconnection-dialog-categories' onChange={() => ({})} tabs={this._categories()} />
    </div>
  )

  private _tabs = (): Tabs.ITab[] => {
    return toArray(this.props.model.registry.getConnectorTypes()).map(type => {
      return {
        tabId: type.name,
        title: type.displayName,
        panel: this._panel(),
      };
    });
  }

  public componentDidMount(): void {
    const connectors = toArray(this.props.model.registry.getConnectorTypes());
    if (connectors.length > 0) {
      this.props.onUpdate('type', connectors[0].name);
    }
  }

  public render() {
    return (
      <Tabs
        id='m-newconnection-dialog'
        vertical={true}
        onChange={(id: string) => this.props.onUpdate('type', id)}
        tabs={this._tabs()}
      />
    );
  }
}

namespace NewConnectionDialog {
  export interface IProps {
    model: DatabaseBrowserModel;
    value: BrowserDialog.IConnection;
    onUpdate(property: keyof BrowserDialog.IConnection, value: string): void;
  }
}

export namespace BrowserDialog {
  export interface IConnection {
    name: string;
    type: string;
    user: string;
    password: string;
    database: string;
    hostname: string;
    port: string;
  }
}
