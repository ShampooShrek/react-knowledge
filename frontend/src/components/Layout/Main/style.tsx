import styled from "styled-components";

interface ContainerType {
  visible: boolean;
}

export const Container = styled.div<ContainerType>`
  width: calc(100% - ${(props) => (props.visible ? "240px" : "0px")});
  min-height: calc(100vh - 48px);

  @media screen and (max-width: 640px) {
    transform: translateX(${(props) => (props.visible ? "100%" : "0px")});
  }
`;
