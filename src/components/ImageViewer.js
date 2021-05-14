const IMAGE_BASE_URL =
  "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public";

export default function ImageViewer({ $app, initialState, onCloseModal }) {
  this.state = initialState;
  this.onCloseModal = onCloseModal;

  this.$target = document.createElement("div");
  this.$target.className = "Modal ImageViewer";
  $app.appendChild(this.$target);

  // close modal
  this.$target.addEventListener("click", (e) => {
    if (e.target === this.$target) {
      this.onCloseModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      this.onCloseModal();
    }
  });

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = `
      <div class="content">
        ${this.state ? `<img src="${IMAGE_BASE_URL}${this.state}" />` : ""}
      </div>
    `;

    this.$target.style.display = this.state ? "block" : "none";
  };

  this.render();
}
