// 首先确认，显示位置在四周

// 1. 获取根结点，插入绝对定位的元素

import * as React from 'react';
import styles from './styles.less';
import ReactDOM from 'react-dom';

type getContainerFunc = () => HTMLElement;
type EventType =
  | React.KeyboardEvent<HTMLDivElement>
  | React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

export interface IDrawerProps {
  closable?: boolean;
  // destroyOnClose?: boolean;
  getContainer?: string | HTMLElement | getContainerFunc | false;
  maskClosable?: boolean;

  mask?: boolean;
  maskStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  /** wrapper dom node style of header and body */
  drawerStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;

  title?: React.ReactNode;
  visible?: boolean;

  width?: number | string;
  height?: number | string;
  /* deprecated, use className instead */
  wrapClassName?: string;
  zIndex?: number;
  // prefixCls?: string;
  // push?: boolean;
  // placement?: placementType;
  onClose?: (e: EventType) => void;

  afterVisibleChange?: (visible: boolean) => void;
  className?: string;

  handler?: React.ReactNode;
  keyboard?: boolean;
}

export interface IDrawerState {
  push?: boolean;
}

// const PlacementTypes = tuple('top', 'right', 'bottom', 'left');
// type placementType = typeof PlacementTypes[number];

export default class Drawer extends React.Component<IDrawerProps, IDrawerState> {
  static defaultProps = {
    width: 256,
    height: 256,
    closable: true,
    // placement: 'right' as placementType,
    maskClosable: true,
    mask: true,
    level: null,
    keyboard: true,
  };

  parentDrawer: HTMLDivElement;

  constructor(props) {
    super(props);
    this.parentDrawer = document.createElement('div');
  }

  public render() {
    const { getContainer } = this.props;
    if (getContainer) {
      return this.props.children;
    } else {
      return ReactDOM.createPortal(this.props.children, this.parentDrawer);
    }
  }
}
