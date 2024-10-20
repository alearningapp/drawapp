#!/bin/sh


VERSION=`git branch --show-current`

dest='../alearningapp.github.io/learning'


GENERATE_SOURCEMAP=false BUILD_PATH=${dest}/${VERSION} PUBLIC_URL=./ npm run build2 -output-hashing=none

#(cd ${dest}  && git pull --rebase)

mkdir -p ${dest}/${VERSION}
if [[ ! $VERSION =~ ^t ]]; then
    sed -E -i  "s|<base href=\"[^\"]*?\">|<base href=\"/learning/${VERSION}/\">|" ${dest}/../index.html
fi
(cd ${dest} && git add . && git commit -am 'update' && while ! git push ; do echo 'lll';done;)
if [[ $VERSION == t* ]]; then
    echo "https://alearningapp.com/learning/${VERSION}/";
fi
echo 'done';
