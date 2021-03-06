#!/bin/bash

os=${OSTYPE//[0-9.-]*/}

case "$os" in
  darwin)
    echo "I'm a Mac"
    cd .. 
    cd Crawler/
    mvn package exec:java
    ;;

  msys)
    echo "I'm Windows using git bash"
    cd ..
    cd Crawler
    "C:\Program Files\Java\jdk-12.0.1\bin\java.exe" "-javaagent:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.1.3\lib\idea_rt.jar=54830:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.1.3\bin" -Dfile.encoding=UTF-8 -classpath "C:\Users\galvi\Galvin\NUS Notes\Orbital\EasyInvest\Crawler\target\classes;C:\Users\galvi\.m2\repository\com\yahoofinance-api\YahooFinanceAPI\3.15.0\YahooFinanceAPI-3.15.0.jar;C:\Users\galvi\.m2\repository\com\fasterxml\jackson\core\jackson-databind\2.9.8\jackson-databind-2.9.8.jar;C:\Users\galvi\.m2\repository\com\fasterxml\jackson\core\jackson-annotations\2.9.0\jackson-annotations-2.9.0.jar;C:\Users\galvi\.m2\repository\com\fasterxml\jackson\core\jackson-core\2.9.8\jackson-core-2.9.8.jar;C:\Users\galvi\.m2\repository\com\squareup\okhttp\okhttp\2.7.5\okhttp-2.7.5.jar;C:\Users\galvi\.m2\repository\com\squareup\okio\okio\1.6.0\okio-1.6.0.jar;C:\Users\galvi\.m2\repository\org\apache\cassandra\cassandra-all\0.8.1\cassandra-all-0.8.1.jar;C:\Users\galvi\.m2\repository\com\google\guava\guava\r08\guava-r08.jar;C:\Users\galvi\.m2\repository\commons-cli\commons-cli\1.1\commons-cli-1.1.jar;C:\Users\galvi\.m2\repository\commons-codec\commons-codec\1.2\commons-codec-1.2.jar;C:\Users\galvi\.m2\repository\commons-collections\commons-collections\3.2.1\commons-collections-3.2.1.jar;C:\Users\galvi\.m2\repository\commons-lang\commons-lang\2.4\commons-lang-2.4.jar;C:\Users\galvi\.m2\repository\com\googlecode\concurrentlinkedhashmap\concurrentlinkedhashmap-lru\1.1\concurrentlinkedhashmap-lru-1.1.jar;C:\Users\galvi\.m2\repository\org\antlr\antlr\3.2\antlr-3.2.jar;C:\Users\galvi\.m2\repository\org\antlr\antlr-runtime\3.2\antlr-runtime-3.2.jar;C:\Users\galvi\.m2\repository\org\antlr\stringtemplate\3.2\stringtemplate-3.2.jar;C:\Users\galvi\.m2\repository\antlr\antlr\2.7.7\antlr-2.7.7.jar;C:\Users\galvi\.m2\repository\org\apache\cassandra\deps\avro\1.4.0-cassandra-1\avro-1.4.0-cassandra-1.jar;C:\Users\galvi\.m2\repository\org\mortbay\jetty\jetty\6.1.22\jetty-6.1.22.jar;C:\Users\galvi\.m2\repository\org\mortbay\jetty\jetty-util\6.1.22\jetty-util-6.1.22.jar;C:\Users\galvi\.m2\repository\org\mortbay\jetty\servlet-api\2.5-20081211\servlet-api-2.5-20081211.jar;C:\Users\galvi\.m2\repository\org\codehaus\jackson\jackson-core-asl\1.4.0\jackson-core-asl-1.4.0.jar;C:\Users\galvi\.m2\repository\org\codehaus\jackson\jackson-mapper-asl\1.4.0\jackson-mapper-asl-1.4.0.jar;C:\Users\galvi\.m2\repository\jline\jline\0.9.94\jline-0.9.94.jar;C:\Users\galvi\.m2\repository\com\googlecode\json-simple\json-simple\1.1\json-simple-1.1.jar;C:\Users\galvi\.m2\repository\com\github\stephenc\high-scale-lib\high-scale-lib\1.1.2\high-scale-lib-1.1.2.jar;C:\Users\galvi\.m2\repository\org\yaml\snakeyaml\1.6\snakeyaml-1.6.jar;C:\Users\galvi\.m2\repository\log4j\log4j\1.2.16\log4j-1.2.16.jar;C:\Users\galvi\.m2\repository\org\apache\thrift\libthrift\0.6.1\libthrift-0.6.1.jar;C:\Users\galvi\.m2\repository\junit\junit\4.4\junit-4.4.jar;C:\Users\galvi\.m2\repository\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar;C:\Users\galvi\.m2\repository\org\apache\httpcomponents\httpclient\4.0.1\httpclient-4.0.1.jar;C:\Users\galvi\.m2\repository\org\apache\httpcomponents\httpcore\4.0.1\httpcore-4.0.1.jar;C:\Users\galvi\.m2\repository\commons-logging\commons-logging\1.1.1\commons-logging-1.1.1.jar;C:\Users\galvi\.m2\repository\org\apache\cassandra\cassandra-thrift\0.8.1\cassandra-thrift-0.8.1.jar;C:\Users\galvi\.m2\repository\com\github\stephenc\jamm\0.2.2\jamm-0.2.2.jar;C:\Users\galvi\.m2\repository\org\slf4j\slf4j-api\1.7.5\slf4j-api-1.7.5.jar;C:\Users\galvi\.m2\repository\org\slf4j\slf4j-log4j12\1.7.5\slf4j-log4j12-1.7.5.jar;C:\Users\galvi\.m2\repository\org\json\json\20190722\json-20190722.jar" Main
    ;;

  linux)
    echo "I'm Linux"
    cd .. 
    cd Crawler/
    mvn package exec:java
    ;;
  *)

  echo "Unknown Operating system $OSTYPE"
  exit 1
esac