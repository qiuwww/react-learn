/**
 * Created by yujianfu on 2016/11/10.
 */
import React, { Component } from "react";
import { Popover, Card, Icon, Collapse } from "antd";
import { fetchPost } from "../../../../utils/request";
import styles from "../../../finance/photoCheck/common/detail/Index.less";
import Viewer from "react-viewer";
import "react-viewer/dist/index.css";
const Panel = Collapse.Panel;

class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      tradeNo: props.tradeNo,
      visible: false,
      activeIndex: 0,
      record: {}
    };
  }

  componentWillReceiveProps(props) {
    if (
      this.state.userId != props.userId ||
      this.state.tradeNo != props.tradeNo
    ) {
      this.setState(
        {
          userId: props.userId,
          tradeNo: props.tradeNo
        },
        () => {
          this.getData();
        }
      );
    }
  }

  componentDidMount() {
    if (this.state.userId && this.state.tradeNo) {
      this.getData();
    }
  }

  getData() {
    if (this.state.tradeNo != null) {
      fetchPost(`/user/${this.state.tradeNo}/faceRecognition/info`, {}).then(
        res => {
          if (res.code === 0) {
            this.setState(
              {
                record: res.data
              }
              // ,
              //   () => {
              //   this.props.changeParams({photoType: res.data.photoType})
              // }
            );
          }
        }
      );
    } else {
      this.setState({
        record: {}
      });
    }
  }

  createPhoto(photos, images, slf) {
    if (photos == null || photos.length == 0) {
      return (
        <span className="no-data">
          <Icon type="frown-o" />
          暂无数据
        </span>
      );
    }
    let content = [];

    photos.map(function(item) {
      let index = images.length;
      images.push({ src: item.key, alt: item.lastModified });
      content.push(
        <div
          key={Math.random()
            .toString(16)
            .substring(2)}
          style={{ width: 200, display: "inline-block" }}
          onClick={() => {
            slf.setState({ visible: true, activeIndex: index });
          }}
        >
          <Card
            style={{ width: 200 }}
            bodyStyle={{ padding: 0 }}
            noHovering={true}
          >
            <div className={styles.customImage}>
              <img alt="example" height="150" width="100%" src={item.key} />
            </div>
            <div className={styles.customCard}>
              <p>日期:{item.lastModified}</p>
            </div>
          </Card>
        </div>
      );
    });

    return content;
  }

  info() {
    const content = (
      <h3>
        <strong>
          Esc：退出全屏&nbsp;&nbsp;← →:切换图片 &nbsp;&nbsp;↑ ↓:放大缩小图片
          &nbsp;&nbsp;Ctrl+1:重置图片 &nbsp;&nbsp;Ctrl+← →:左右旋转
        </strong>
      </h3>
    );

    return (
      <div>
        手持身份证
        <Popover content={content}>
          <Icon className="ml10" type="exclamation-circle-o" />
        </Popover>
      </div>
    );
  }

  render() {
    if (this.state.record == null) {
      return (
        <span className="no-data">
          <Icon type="frown-o" />
          暂无数据
        </span>
      );
    }
    let images = [];
    let slf = this;

    return (
      <div className={styles.detailModule}>
        <Card title="照片审核" bodyStyle={{ padding: 0 }} noHovering={true}>
          <Collapse defaultActiveKey={["1", "2", "3"]}>
            <Panel header={this.info()} key="1">
              <div style={{ maxHeight: 195, overflow: "auto" }}>
                {this.createPhoto(
                  this.state.record.holdCardimages,
                  images,
                  slf
                )}
              </div>
            </Panel>
            <Panel header="身份证反面" key="2">
              <div style={{ maxHeight: 195, overflow: "auto" }}>
                {this.createPhoto(this.state.record.cardImages, images, slf)}
              </div>
            </Panel>
            <Panel header="生活照" key="3">
              <div style={{ maxHeight: 195, overflow: "auto" }}>
                {this.createPhoto(this.state.record.lifeImages, images, slf)}
              </div>
            </Panel>
          </Collapse>
        </Card>
        <Viewer
          visible={this.state.visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
          images={images}
          activeIndex={this.state.activeIndex}
        />
      </div>
    );
  }
}

export default Photo;
