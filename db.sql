CREATE DATABASE IF NOT EXISTS DB_FINDX default character set utf8 COLLATE utf8_general_ci;
USE DB_FINDX;

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `platform` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `channel` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '渠道号， 0-未知',
  `name` varchar(64) NOT NULL COMMENT '帐号名',
  `pic` varchar(128) NOT NULL DEFAULT '无' COMMENT '头像网址',
  `sex` varchar(8) NOT NULL DEFAULT '0' COMMENT '性别',
  `age` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '年龄',
  `stage` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '已经玩到的最高关卡',
  `login_cnt` int(10) unsigned NOT NULL DEFAULT 1 COMMENT '登录次数',
  `reg_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次进入时间',
  `login_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`user_id`, `platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `t_vip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `platform` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `end_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'VIP结束进时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `t_pay_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `platform` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `orderId` varchar(64) NOT NULL COMMENT '订单号',
  `money` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '人民币，单位分',
  `pay_time` timestamp NOT NULL COMMENT '支付时间',
  `serverId` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '游戏区服id',
  `goodsId` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '游戏提供的充值档id',
  `goodsNumber` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Nest目前固定为1',
  `ext` varchar(64) NOT NULL COMMENT '原样返回游戏透传的数据',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `t_stage_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `platform` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `stage` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '通的是第几关，只记录通关的，失败的不记录',
  `play_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交玩关卡时的时间',
  `cost_time` int(10) unsigned NOT NULL DEFAULT 30 COMMENT '打通本关花费的时间,单位秒*10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
