CREATE DATABASE IF NOT EXISTS DB_FINDX default character set utf8 COLLATE utf8_general_ci;
USE DB_FINDX;

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `channel` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `name` varchar(64) NOT NULL COMMENT '帐号名',
  `pic` varchar(128) NOT NULL DEFAULT '无' COMMENT '头像网址',
  `sex` varchar(8) NOT NULL DEFAULT '未知' COMMENT '性别',
  `age` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '年龄',
  `vip` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '0表示不是VIP, 数字表示开通时的金额，单位分',
  `stage` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '已经玩到的最高关卡',
  `reg_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次进入时间',
  `login_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`user_id`, `channel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `t_vip_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `channel` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `vip` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '数字表示开通时的金额，单位分',
  `pay_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次进入时间',
  `for_days` int(10) unsigned NOT NULL DEFAULT 30 COMMENT '本次支付购买VIP的天数, 从支付当日算起',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `t_stage_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `channel` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `stage` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '通的是第几关，只记录通关的，失败的不记录',
  `play_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交玩关卡时的时间',
  `cost_time` int(10) unsigned NOT NULL DEFAULT 30 COMMENT '打通本关花费的时间,单位秒*10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
