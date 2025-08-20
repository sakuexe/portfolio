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
        ];
      };
    };
}
