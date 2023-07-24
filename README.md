# Blocklease.io : Marketplace de location de NFTs

Bienvenue sur Blocklease.io, une application dont le but est que vous puissiez vous aussi avoir un Bored Ape en photo de profil sans devoir hypothéquer votre maison pour cela :)

## ERC-4907

L’[ERC-4907](https://eips.ethereum.org/EIPS/eip-4907), extension du token ERC-721, est un nouveau standard NFT implémenté par l’Ethereum Improvement Proposal afin de permettre la mise en location de ces derniers.

Tout l’intérêt apporté par l’EIP-4907 réside dans la dissociation de la propriété d’un NFT, des droits d’utilisations de celui-ci. En d’autres termes, cette nouvelle fonctionnalité permet de déléguer, pendant une période donnée, certains droits accordés par le NFT. Il est par exemple possible de louer le terrain d’un metaverse pour y créer un évènement éphémère !

Tout est paramétré à l’avance, que ce soit le prix de la location, la durée de celle-ci et les droits qu’elle confère. Cela apporte une plus grande flexibilité au marché. Ainsi, il n’est plus nécessaire de dépenser des centaines, voir des milliers de dollars, pour jouer à son jeu blockchain préféré.

## Documentation fonctionnelle

[One Pager](https://drive.google.com/file/d/1iDfvkr6yB4Vo8Ep6KajW_O69BU46NEH0/view?usp=drive_link)

[Litepaper](https://drive.google.com/file/d/1i3Ps65-EV20pObH7KEnHcrpQOHrlIAI3/view?usp=sharing)

Magnifique [schéma](https://excalidraw.com/#json=9whPmca8eCzk6KQ0djpkj,yYg8rR1y8qnpQuu4FOlgFg)

## Video

Pssst... une vidéo de démonstration est disponible [ici](https://youtu.be/SDMuUQSGhRE)

## Application

Vous pouvez utiliser l'application en vous rendant ici : ...

## Contrat

Le contrat de la marketplace est déployé sur le testnet Goerli.

Marketplace : [0xc5ED11eD3B4B21406ec05dD74E52602aC43d2bD4](https://goerli.etherscan.io/address/0xc5ED11eD3B4B21406ec05dD74E52602aC43d2bD4)

## Utilisation locale

### Démarrage

Cloner le repo
```bash
git clone https://github.com/KevinFarani/Alyra-Dapp-Blocklease.git
```

### Déploiement

Placez vous dans le dossier backend
```bash
cd Alyra-Dapp-Blocklease/backend
```
Installez les dépendances
```bash
npm install
```
Ouvrez un nouveau terminal au même endroit et lancez la blockchain locale hardhat
```bash
npx harhat node
```
Lancez le déploiement
```bash
npx hardhat run scripts/01_deploy.js --network localhost
```
Optionnel : lancez les scripts de peuplement
```bash
npx hardhat run scripts/02_mint.js --network localhost
npx hardhat run scripts/03_listing.js --network localhost
```

### Lancement de l'application

Placez vous dans le dossier frontend et lancez l'application
```bash
cd Alyra-Dapp-Voting/frontend
```
Installez les dépendances
```bash
npm install
```
Modifiez les constantes des contrats 
```bash
Mettre en service le code commenté et préfixé par USE FOR LOCAL BLOCKCHAIN
```
```bash
cd Alyra-Dapp-Voting/frontend
npm run dev
```
Connectez vous à l'adresse : [http://localhost:3000/](http://localhost:3000/)

### Tests unitaires

Placez vous dans le dossier backend
```bash
cd Alyra-Dapp-Blocklease/backend
```
Si ce n'est pas déjà fait, ouvrez un nouveau terminal au même endroit et lancez la blockchain locale hardhat
```bash
npx harhat node
```
Lancez les tests
```bash
npx hardhat test
```
Visualisez le coverage
```bash
npx hardhat coverage
```
Vous devriez optenir ce résultat :
```bash
----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 contracts/           |    96.71 |    85.71 |    92.31 |    96.55 |                |
  ERC4907.sol         |    81.82 |     62.5 |    83.33 |    78.57 |       66,91,92 |
  IERC4907.sol        |      100 |      100 |      100 |      100 |                |
  Marketplace.sol     |    99.24 |    88.16 |      100 |    99.33 |            522 |
  NotRentableNFTs.sol |       80 |      100 |    66.67 |       80 |             21 |
  RentableNFTs.sol    |       80 |      100 |    66.67 |       80 |             21 |
----------------------|----------|----------|----------|----------|----------------|
All files             |    96.71 |    85.71 |    92.31 |    96.55 |                |
----------------------|----------|----------|----------|----------|----------------|
```
## Credits

@KevinFarani en tant que developpeur

Alexandre P. et Idoumou B. en tant que consultants
