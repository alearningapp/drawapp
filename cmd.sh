GENERATE_SOURCEMAP=false npm run build
cd ../alearingapp.github.io/  && git pull --rebase
cp -a build/* ../alearingapp.github.io/
cd ../alearingapp.github.io/ && git add . && git commit -am 'update' && git push