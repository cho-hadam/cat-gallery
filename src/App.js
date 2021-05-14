import { request } from "./api/api.js";
import Breadcrumb from "./components/Breadcrumb.js";
import ImageViewer from "./components/ImageViewer.js";
import Loading from "./components/Loading.js";
import Nodes from "./components/Nodes.js";

export default function App($app) {
  this.state = {
    isRoot: false,
    nodes: [],
    depth: [],
    selectedFilePath: null,
    isLoading: false,
  };

  const imageViewer = new ImageViewer({
    $app,
    initialState: this.state.selectedFilePath,
    onCloseModal: () => {
      this.setState({
        ...this.state,
        selectedFilePath: null,
      });
    },
  });

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
  });

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    },
    onClick: async (node) => {
      try {
        if (node.type === "DIRECTORY") {
          try {
            this.setState({
              ...this.state,
              isLoading: true,
            });

            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              isRoot: false,
              depth: [...this.state.depth, node],
              nodes: nextNodes,
            });
          } catch (e) {
            console.error(`Error: ${e.message}`);
          } finally {
            this.setState({
              ...this.state,
              isLoading: false,
            });
          }
        } else if (node.type === "FILE") {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          });
        }
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    },
    onBackClick: async () => {
      try {
        this.setState({
          ...this.state,
          isLoading: true,
        });

        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        if (prevNodeId === null) {
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: rootNodes,
          });
        } else {
          const prevNodes = await request(prevNodeId);

          this.setState({
            ...nextState,
            isRoot: false,
            nodes: prevNodes,
          });
        }
      } catch (e) {
        console.error(`Error: ${e.message}`);
      } finally {
        this.setState({
          ...this.state,
          isLoading: false,
        });
      }
    },
  });

  const loading = new Loading({
    $app,
    initialState: this.state.isLoading,
  });

  this.setState = (nextState) => {
    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    imageViewer.setState(this.state.selectedFilePath);
    loading.setState(this.state.isLoading);
  };

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true,
      });
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });
    } catch (e) {
      console.error(`${e} Error: ${e.message}`);
    } finally {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  };

  init();
}
