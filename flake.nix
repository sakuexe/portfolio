{
  # using zsh, enter the shell using: nix develop --command zsh
  description = "Development flake for the portfolio project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        propagatedBuildInputs = with pkgs; [
          nodejs_24
        ];

        shellHook = ''
          WEBSITE_URL="https://sakukarttunen.com"
          WEBSITE_EXISTS="$(tmux list-windows | grep website)"
          if [[ ! $WEBSITE_EXISTS ]]; then
            tmux new-window -n website \
              "nix develop --command zsh -ic 'cd website && npm run dev; exec zsh'"
            tmux split-window -t website -v -l 20% \
              "nix develop --command zsh -ic 'docker run --rm -it -p 5000:80 -p 2525:25 rnwood/smtp4dev'"
          fi
        '';
      };
    };
}
