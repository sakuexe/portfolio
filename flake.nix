{
  # using zsh, enter the shell using: nix develop --command zsh
  description = "Development flake for the portfolio project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
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
          dotnetCorePackages.dotnet_9.sdk
          dotnetCorePackages.dotnet_9.runtime
          csharp-ls
          nodejs_24
          smtp4dev
          dotnet-ef
        ];

        shellHook = ''
          WEBSITE_URL="https://sakukarttunen.com"
          FRONTEND_EXISTS="$(tmux list-windows | grep frontend)"
          if [[ ! $FRONTEND_EXISTS ]]; then
            tmux new-window -n frontend \
              "nix develop --command zsh -ic 'cd frontend && npm run dev; exec zsh'"
            (sleep 5; xdg-open http://localhost:4321) &
          fi

          BACKEND_EXISTS="$(tmux list-windows | grep backend)"
          if [[ ! $BACKEND_EXISTS ]]; then
            tmux new-window -n backend \
              "nix develop --command zsh -ic 'cd backend && dotnet watch; exec zsh'"
          fi
        '';
      };

      # a quick script for rebasing the main branch into prod
      # to run it do `nix run #deploy`
      packages.${system}.deploy = pkgs.writeShellScriptBin "prod" ''
        set -e # exit on errors
        ${pkgs.git}/bin/git switch prod
        ${pkgs.git}/bin/git rebase main
        ${pkgs.git}/bin/git push origin prod
        ${pkgs.git}/bin/git switch main
      '';

    };
}
