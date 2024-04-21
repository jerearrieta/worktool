Vue.createApp({
  data() {
    return {
      mensajesEnStorage: [],
      mensajesGuardados: [],
      mensajeCapturado: {},
      selectedBackground: "default",
    };
  },
  created() {
    this.mensajesEnStorage = JSON.parse(localStorage.getItem("mensajes"));
    if (this.mensajesEnStorage) {
      this.mensajesGuardados = this.mensajesEnStorage;
    }
    this.$nextTick(() => {
      new Sortable(document.querySelector("section"), {
        animation: 150,
        onEnd: (evt) => {
          let itemMoved = this.mensajesGuardados.splice(evt.oldIndex, 1)[0];
          this.mensajesGuardados.splice(evt.newIndex, 0, itemMoved);
          localStorage.setItem(
            "mensajes",
            JSON.stringify(this.mensajesGuardados)
          );
        },
      });
    });
  },
  methods: {
    crearMensaje() {
      Swal.fire({
        title: "Create message button",
        html:
          '<div class="form-sweet"> <h3>title message</h2> <input id="swal-input1" type="text" class="swal2-input">' +
          ' <h3>content message</h2> <textarea id="swal-input2" type="textarea" class="swal2-input"></textarea></div>',
        focusConfirm: false,
        showDenyButton: true,
        denyButtonText: `Don't save`,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
          ];
        },
      }).then((result) => {
        if (result.isConfirmed) {
          let mensaje = {
            titulo: document.getElementById("swal-input1").value,
            mensaje: document.getElementById("swal-input2").value,
          };

          this.mensajesGuardados.push(mensaje);
          localStorage.setItem(
            "mensajes",
            JSON.stringify(this.mensajesGuardados)
          );

          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "error");
        }
      });
    },
    capturarMensaje(mensaje) {
      this.mensajeCapturado = mensaje;
      console.log(this.mensajeCapturado);
    },
    eliminarMensaje(mensaje) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajesEnStorage = this.mensajesEnStorage.filter(
            (msg) => msg.titulo !== mensaje.titulo
          );
          this.mensajesGuardados = this.mensajesEnStorage;
          console.log(this.mensajesGuardados);
          localStorage.setItem(
            "mensajes",
            JSON.stringify(this.mensajesGuardados)
          );

          Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Message not deleted", "", "info");
        }
      });
    },
    copiarMensaje(msg) {
      var copyText = msg.mensaje;

      navigator.clipboard.writeText(copyText);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Message copied",
        showConfirmButton: false,
        timer: 900,
        width: 200,
      });
    },
  },
  watch: {
    selectedBackground(newValue) {
      const button = document.querySelector("#create button");
      if (newValue === "default") {
        document.body.style.backgroundImage = "url('./images/billie.jpg')";
        button.style.backgroundColor = "#8e795a";
        button.classList.remove("hover-effect-background1");
        button.classList.add("hover-effect-default");
        localStorage.setItem("selectedBackground", "default");
      } else if (newValue === "background1") {
        document.body.style.backgroundImage = "url('./images/negro.jpeg')";
        button.style.backgroundColor = "#6e53d6";
        button.classList.remove("hover-effect-default");
        button.classList.add("hover-effect-background1");
        localStorage.setItem("selectedBackground", "background1");
      }
    },
  },
  mounted() {
    const selectedBackground = localStorage.getItem("selectedBackground");
    if (selectedBackground) {
      this.selectedBackground = selectedBackground;
    }
  },
  computed: {},
}).mount("#app");
