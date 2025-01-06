{
  # using zsh, enter the shell using: nix develop --command zsh
  description = "Development flake for Dotnet and Neovim";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem(system:
      let
        pkgs = import nixpkgs { 
          inherit system; 
          config.allowUnfree = true; # enable the use of proprietary packages
        };
      in
      {
        devShell = with pkgs; mkShell {
          buildInputs = [
            dotnetCorePackages.dotnet_8.sdk
            dotnetCorePackages.dotnet_8.runtime
            dotnet-ef
            csharp-ls
            neovim
          ];
          shellHook = ''
            clear
            VIOLET='\033[0;35m'
            CLEAR='\033[0m'
            echo -e "💽$VIOLET Dotnet development shell $CLEAR"
          '';
        };
      });
}
